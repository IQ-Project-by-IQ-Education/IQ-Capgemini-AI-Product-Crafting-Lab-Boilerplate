# npm install stress test for /diagnostic-windows.
#
# Simulates installing a realistic Next.js project in a throwaway folder
# (never inside the participant's project) to see whether Capgemini security
# lets npm downloads through, slows them down, or makes them hang forever.
#
# Hard-coded limits (do not change during a diagnostic):
#   - each install attempt is killed after $TimeoutSeconds
#   - each stage gets $MaxAttempts tries (1 try + 2 retries), then we move on
#   - an install that succeeds but takes longer than $SlowSeconds is flagged SLOW
# The script always finishes and always exits 0, so it never blocks the diagnostic.
#
# Usage (works on Windows PowerShell 5.1 and PowerShell 7):
#   powershell -NoProfile -ExecutionPolicy Bypass -File npm-install-test.ps1            stress test (2 stages)
#   powershell -NoProfile -ExecutionPolicy Bypass -File npm-install-test.ps1 -Project   install the current
#                                     project's own dependencies with the same timeout and retries

param([switch]$Project)

$TimeoutSeconds = 180
$MaxAttempts = 3
$SlowSeconds = 60

$ErrorActionPreference = 'Continue'
$WorkRoot = Join-Path $env:TEMP "capgemini-npm-test-$PID"
$ProjectDir = (Get-Location).Path

if ($Project) {
  Write-Output "NPM INSTALL - PROJECT DEPENDENCIES - WINDOWS"
  Write-Output "Project folder: $ProjectDir"
} else {
  Write-Output "NPM INSTALL STRESS TEST - WINDOWS"
}
Write-Output "Started: $(Get-Date)"
Write-Output "Timeout per attempt: ${TimeoutSeconds}s | Attempts per stage: $MaxAttempts | Flagged slow above: ${SlowSeconds}s"
if (-not $Project) { Write-Output "Throwaway folder: $WorkRoot (deleted at the end)" }
Write-Output ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Output "Node.js: NOT INSTALLED (node command not found)"
  Write-Output "RESULT: SKIPPED - Node.js is not installed, the npm install test cannot run."
  Write-Output "NPM INSTALL TEST DONE"
  exit 0
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Output "Node.js: $(node -v)"
  Write-Output "npm: NOT INSTALLED (npm command not found)"
  Write-Output "RESULT: SKIPPED - npm is not installed, the npm install test cannot run."
  Write-Output "NPM INSTALL TEST DONE"
  exit 0
}

# npm is called through cmd.exe so it works even when PowerShell blocks npm.ps1
Write-Output "Node.js: $(node -v)"
Write-Output "npm: $(cmd.exe /c 'npm -v' 2>$null)"
Write-Output "npm registry: $(cmd.exe /c 'npm config get registry' 2>$null)"
Write-Output "npm proxy: $(cmd.exe /c 'npm config get proxy' 2>$null)"
Write-Output "npm https-proxy: $(cmd.exe /c 'npm config get https-proxy' 2>$null)"
Write-Output "npm strict-ssl: $(cmd.exe /c 'npm config get strict-ssl' 2>$null)"
Write-Output "npm cafile: $(cmd.exe /c 'npm config get cafile' 2>$null)"
$proxyEnv = "$env:HTTP_PROXY$env:HTTPS_PROXY"
Write-Output "HTTP_PROXY / HTTPS_PROXY set in environment: $(if ($proxyEnv) { 'yes' } else { 'no' })"
Write-Output ""

if (-not $Project) {
  try { New-Item -ItemType Directory -Force -Path $WorkRoot -ErrorAction Stop | Out-Null }
  catch {
    Write-Output "RESULT: SKIPPED - cannot create $WorkRoot"
    Write-Output "NPM INSTALL TEST DONE"
    exit 0
  }
}

# Stage 1: what a typical Next.js app needs from the npm registry.
$Stage1Json = @'
{
  "name": "capgemini-npm-test-basic",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
'@

# Stage 2: many popular libraries, plus the kinds of downloads security tools
# often block: native binaries (sharp, @swc/core), a package that runs its own
# install script (esbuild), and a package pulled straight from GitHub.
$Stage2Json = @'
{
  "name": "capgemini-npm-test-extended",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zod": "latest",
    "date-fns": "latest",
    "clsx": "latest",
    "uuid": "latest",
    "axios": "latest",
    "zustand": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest",
    "recharts": "latest",
    "@tanstack/react-query": "latest",
    "@radix-ui/react-dialog": "latest",
    "sharp": "latest",
    "esbuild": "latest",
    "@swc/core": "latest",
    "escape-string-regexp": "https://codeload.github.com/sindresorhus/escape-string-regexp/tar.gz/refs/tags/v5.0.0"
  }
}
'@

$Summary = @()
$ErrorCodes = 'ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_GET_ISSUER_CERT_LOCALLY|UNABLE_TO_VERIFY_LEAF_SIGNATURE|CERT_HAS_EXPIRED|ERR_SSL[A-Z_]*|E403|E401|E404|E407|EPERM|EACCES|EBUSY|EINTEGRITY|ENOSPC'

# Run-Stage <name> <folder> [package.json content]
# With package.json content: throwaway stage (fresh lock + fresh cache every attempt).
# Without: the real project (keeps package-lock.json and the normal npm cache).
function Run-Stage($StageName, $StageDir, $StageJson) {
  $cacheArgs = ''
  if ($StageJson) {
    New-Item -ItemType Directory -Force -Path $StageDir | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $StageDir 'package.json'), $StageJson)  # UTF-8 without BOM
    $logDir = $StageDir
    # Fresh cache in the throwaway folder: forces real downloads and never touches the user's npm cache
    $cacheArgs = " --cache `"$(Join-Path $StageDir '.npm-cache')`""
  } else {
    $logDir = $env:TEMP
  }

  Write-Output "=== $StageName ==="
  $status = ''
  $duration = 0
  $lastLog = ''
  $attempt = 1
  while ($attempt -le $MaxAttempts) {
    if ($StageJson) {
      Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $StageDir 'node_modules'), (Join-Path $StageDir 'package-lock.json')
    } elseif ($attempt -gt 1) {
      # a killed install can leave a broken folder behind
      Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $StageDir 'node_modules')
    }
    $lastLog = Join-Path $logDir "capgemini-npm-attempt-$PID-$attempt.log"

    $start = Get-Date
    $cmdLine = "/d /s /c `"npm install --no-audit --no-fund --loglevel=http$cacheArgs > `"$lastLog`" 2>&1`""
    $proc = Start-Process -FilePath 'cmd.exe' -ArgumentList $cmdLine -WorkingDirectory $StageDir -WindowStyle Hidden -PassThru
    $null = $proc.Handle  # needed so ExitCode is readable on Windows PowerShell 5.1
    $finished = $proc.WaitForExit($TimeoutSeconds * 1000)
    $duration = [int]((Get-Date) - $start).TotalSeconds

    if (-not $finished) {
      # kill npm and every child process it started (node, install scripts...)
      & taskkill.exe /PID $proc.Id /T /F 2>&1 | Out-Null
      Start-Sleep -Seconds 3
      $status = 'TIMEOUT'
      Write-Output "Attempt $attempt/${MaxAttempts}: TIMED OUT after ${TimeoutSeconds}s (killed)"
      $lastFetch = Select-String -Path $lastLog -Pattern 'http fetch' -ErrorAction SilentlyContinue | Select-Object -Last 1
      if ($lastFetch) { $lastFetch = $lastFetch.Line -replace '^npm ', '' } else { $lastFetch = 'none - npm could not download anything' }
      Write-Output "  Last download npm finished before hanging: $lastFetch"
    } elseif ($proc.ExitCode -eq 0) {
      $status = 'OK'
      Write-Output "Attempt $attempt/${MaxAttempts}: SUCCESS in ${duration}s"
      break
    } else {
      $status = 'FAILED'
      Write-Output "Attempt $attempt/${MaxAttempts}: FAILED after ${duration}s (exit code $($proc.ExitCode))"
    }
    $attempt++
  }

  if ($status -eq 'OK') {
    $packages = @(Get-ChildItem -Path (Join-Path $StageDir 'node_modules') -Filter package.json -Recurse -Depth 2 -ErrorAction SilentlyContinue).Count
    if ($duration -gt $SlowSeconds) { $result = "PASSED BUT SLOW (${duration}s, expected under ${SlowSeconds}s)" }
    else { $result = "PASSED (${duration}s)" }
    if ($attempt -gt 1) { $result = "$result - needed $attempt attempts" }
    Write-Output "  Packages installed: about $packages"
  } elseif ($status -eq 'TIMEOUT') {
    $result = "TIMED OUT on all $MaxAttempts attempts (npm hangs - likely blocked or throttled by a proxy/firewall/antivirus)"
  } else {
    $result = "FAILED on all $MaxAttempts attempts"
  }

  if ($status -ne 'OK') {
    Write-Output "  Known error codes found in the log:"
    if (Test-Path $lastLog) {
      Select-String -Path $lastLog -Pattern $ErrorCodes -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Value } |
        Group-Object | ForEach-Object { "    $($_.Count) $($_.Name)" }
      Write-Output "  Last 15 lines of the npm log:"
      Get-Content $lastLog -Tail 15 | ForEach-Object { "    $_" }
    }
  }
  if (-not $StageJson) { Remove-Item -Force -ErrorAction SilentlyContinue (Join-Path $logDir "capgemini-npm-attempt-$PID-*.log") }
  Write-Output "  Result: $result"
  Write-Output ""
  $script:Summary += "- ${StageName}: $result"
}

if ($Project) {
  Run-Stage 'Project dependencies (npm install in the project folder)' $ProjectDir $null
} else {
  Run-Stage 'Stage 1 - Basic Next.js app (next, react, typescript, eslint, tailwind)' (Join-Path $WorkRoot 'basic') $Stage1Json
  Run-Stage 'Stage 2 - Many libraries + native binaries + install scripts + GitHub download' (Join-Path $WorkRoot 'extended') $Stage2Json
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $WorkRoot
}

Write-Output "SUMMARY"
$Summary | ForEach-Object { Write-Output $_ }
Write-Output "Finished: $(Get-Date)"
Write-Output "NPM INSTALL TEST DONE"
exit 0

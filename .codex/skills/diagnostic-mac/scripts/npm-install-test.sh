#!/bin/bash
# npm install stress test for /diagnostic-mac.
#
# Simulates installing a realistic Next.js project in a throwaway folder
# (never inside the participant's project) to see whether Capgemini security
# lets npm downloads through, slows them down, or makes them hang forever.
#
# Hard-coded limits (do not change during a diagnostic):
#   - each install attempt is killed after TIMEOUT_SECONDS
#   - each stage gets MAX_ATTEMPTS tries (1 try + 2 retries), then we move on
#   - an install that succeeds but takes longer than SLOW_SECONDS is flagged SLOW
# The script always finishes and always exits 0, so it never blocks the diagnostic.
#
# Usage:
#   bash npm-install-test.sh            stress test in a throwaway folder (2 stages)
#   bash npm-install-test.sh --project  install the current project's own dependencies
#                                       with the same timeout and retries

TIMEOUT_SECONDS=180
MAX_ATTEMPTS=3
SLOW_SECONDS=60

set -m  # background jobs get their own process group, so a timeout kills npm and all its children

WORK_ROOT="${TMPDIR:-/tmp}"
WORK_ROOT="${WORK_ROOT%/}/capgemini-npm-test-$$"
PROJECT_MODE=no
[ "$1" = "--project" ] && PROJECT_MODE=yes && PROJECT_DIR="$(pwd)"

if [ "$PROJECT_MODE" = yes ]; then
  echo "NPM INSTALL - PROJECT DEPENDENCIES - MAC"
  echo "Project folder: $PROJECT_DIR"
else
  echo "NPM INSTALL STRESS TEST - MAC"
fi
echo "Started: $(date)"
echo "Timeout per attempt: ${TIMEOUT_SECONDS}s | Attempts per stage: ${MAX_ATTEMPTS} | Flagged slow above: ${SLOW_SECONDS}s"
[ "$PROJECT_MODE" = no ] && echo "Throwaway folder: $WORK_ROOT (deleted at the end)"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js: NOT INSTALLED (node command not found)"
  echo "RESULT: SKIPPED - Node.js is not installed, the npm install test cannot run."
  echo "NPM INSTALL TEST DONE"
  exit 0
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js: $(node -v)"
  echo "npm: NOT INSTALLED (npm command not found)"
  echo "RESULT: SKIPPED - npm is not installed, the npm install test cannot run."
  echo "NPM INSTALL TEST DONE"
  exit 0
fi

echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "npm registry: $(npm config get registry 2>/dev/null)"
echo "npm proxy: $(npm config get proxy 2>/dev/null)"
echo "npm https-proxy: $(npm config get https-proxy 2>/dev/null)"
echo "npm strict-ssl: $(npm config get strict-ssl 2>/dev/null)"
echo "npm cafile: $(npm config get cafile 2>/dev/null)"
echo "HTTP_PROXY / HTTPS_PROXY set in environment: $([ -n "$HTTP_PROXY$HTTPS_PROXY$http_proxy$https_proxy" ] && echo yes || echo no)"
echo

[ "$PROJECT_MODE" = no ] && { mkdir -p "$WORK_ROOT" || { echo "RESULT: SKIPPED - cannot create $WORK_ROOT"; echo "NPM INSTALL TEST DONE"; exit 0; }; }

# Stage 1: what a typical Next.js app needs from the npm registry.
STAGE1_JSON='{
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
}'

# Stage 2: many popular libraries, plus the kinds of downloads security tools
# often block: native binaries (sharp, @swc/core), a package that runs its own
# install script (esbuild), and a package pulled straight from GitHub.
STAGE2_JSON='{
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
}'

SUMMARY=""

# run_stage <name> <folder> [package.json content]
# With package.json content: throwaway stage (fresh lock + fresh cache every attempt).
# Without: the real project (keeps package-lock.json and the normal npm cache).
run_stage() {
  local stage_name="$1" stage_dir="$2" stage_json="$3"
  local attempt=1 status="" duration=0 last_log="" log_dir cache_args=""

  if [ -n "$stage_json" ]; then
    mkdir -p "$stage_dir"
    printf '%s\n' "$stage_json" > "$stage_dir/package.json"
    log_dir="$stage_dir"
    # Fresh cache in the throwaway folder: forces real downloads and never touches ~/.npm
    cache_args="--cache $stage_dir/.npm-cache"
  else
    log_dir="${TMPDIR:-/tmp}"
    log_dir="${log_dir%/}"
  fi

  echo "=== $stage_name ==="
  while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
    if [ -n "$stage_json" ]; then
      rm -rf "$stage_dir/node_modules" "$stage_dir/package-lock.json"
    elif [ "$attempt" -gt 1 ]; then
      rm -rf "$stage_dir/node_modules"  # a killed install can leave a broken folder behind
    fi
    last_log="$log_dir/capgemini-npm-attempt-$$-$attempt.log"

    local start=$(date +%s)
    (cd "$stage_dir" && exec npm install --no-audit --no-fund --loglevel=http $cache_args) > "$last_log" 2>&1 &
    local pid=$!
    local timed_out=no
    while kill -0 "$pid" 2>/dev/null; do
      if [ $(( $(date +%s) - start )) -ge "$TIMEOUT_SECONDS" ]; then
        timed_out=yes
        kill -TERM -- "-$pid" 2>/dev/null
        sleep 3
        kill -KILL -- "-$pid" 2>/dev/null
        break
      fi
      sleep 1
    done
    wait "$pid" 2>/dev/null
    local code=$?
    duration=$(( $(date +%s) - start ))

    if [ "$timed_out" = yes ]; then
      status="TIMEOUT"
      echo "Attempt $attempt/$MAX_ATTEMPTS: TIMED OUT after ${TIMEOUT_SECONDS}s (killed)"
      local last_fetch=$(grep -E 'http fetch' "$last_log" | tail -1 | sed 's/^npm //')
      echo "  Last download npm finished before hanging: ${last_fetch:-none - npm could not download anything}"
    elif [ "$code" -eq 0 ]; then
      status="OK"
      echo "Attempt $attempt/$MAX_ATTEMPTS: SUCCESS in ${duration}s"
      break
    else
      status="FAILED"
      echo "Attempt $attempt/$MAX_ATTEMPTS: FAILED after ${duration}s (exit code $code)"
    fi
    attempt=$((attempt + 1))
  done

  local result
  if [ "$status" = OK ]; then
    local packages=$(find "$stage_dir/node_modules" -name package.json -maxdepth 3 2>/dev/null | wc -l | tr -d ' ')
    if [ "$duration" -gt "$SLOW_SECONDS" ]; then
      result="PASSED BUT SLOW (${duration}s, expected under ${SLOW_SECONDS}s)"
    else
      result="PASSED (${duration}s)"
    fi
    [ "$attempt" -gt 1 ] && result="$result - needed $attempt attempts"
    echo "  Packages installed: about $packages"
  elif [ "$status" = TIMEOUT ]; then
    result="TIMED OUT on all $MAX_ATTEMPTS attempts (npm hangs - likely blocked or throttled by a proxy/firewall)"
  else
    result="FAILED on all $MAX_ATTEMPTS attempts"
  fi

  if [ "$status" != OK ]; then
    echo "  Known error codes found in the log:"
    grep -oE 'ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_GET_ISSUER_CERT_LOCALLY|UNABLE_TO_VERIFY_LEAF_SIGNATURE|CERT_HAS_EXPIRED|ERR_SSL[A-Z_]*|E403|E401|E404|E407|EPERM|EACCES|EINTEGRITY|ENOSPC' "$last_log" | sort | uniq -c | sed 's/^/    /'
    echo "  Last 15 lines of the npm log:"
    tail -15 "$last_log" | sed 's/^/    /'
  fi
  [ -z "$stage_json" ] && rm -f "$log_dir"/capgemini-npm-attempt-$$-*.log
  echo "  Result: $result"
  echo
  SUMMARY="$SUMMARY
- $stage_name: $result"
}

# stderr goes to /dev/null so the shell's "Terminated" job notices don't clutter the report
if [ "$PROJECT_MODE" = yes ]; then
  run_stage "Project dependencies (npm install in the project folder)" "$PROJECT_DIR" 2>/dev/null
else
  run_stage "Stage 1 - Basic Next.js app (next, react, typescript, eslint, tailwind)" "$WORK_ROOT/basic" "$STAGE1_JSON" 2>/dev/null
  run_stage "Stage 2 - Many libraries + native binaries + install scripts + GitHub download" "$WORK_ROOT/extended" "$STAGE2_JSON" 2>/dev/null
  rm -rf "$WORK_ROOT"
fi

echo "SUMMARY$SUMMARY"
echo "Finished: $(date)"
echo "NPM INSTALL TEST DONE"
exit 0

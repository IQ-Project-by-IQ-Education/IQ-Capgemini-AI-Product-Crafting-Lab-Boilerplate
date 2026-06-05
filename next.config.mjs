/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let the SQLite library load natively on the server side.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Uncomment for a fully static export (deploy to Azure Static Web Apps / any CDN):
  // output: "export",
  transpilePackages: ["duma-icons", "duma-icons-react"],
};

export default nextConfig;

import pkg from "@vanilla-extract/next-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { domains: ["firebasestorage.googleapis.com"] },
};

const withVanillaExtract = pkg.createVanillaExtractPlugin({
  identifiers: "debug",
});

export default withVanillaExtract(nextConfig);

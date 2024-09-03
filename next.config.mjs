/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
      },
    ],
  },
};

export default config;

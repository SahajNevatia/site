/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fordelviden.com',
            
          },
        ],
      },
};

export default nextConfig;

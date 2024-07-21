/** @type {import('next').NextConfig} */


const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com', // spotify pfp
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // google pfp
            },
            {
                protocol: 'https',
                hostname: 'i.scdn.co', // spotify album art
            },
        ],
    },
};

export default nextConfig;
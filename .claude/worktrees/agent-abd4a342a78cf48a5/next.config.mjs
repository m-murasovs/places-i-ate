/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh5.googleusercontent.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'streetviewpixels-pa.googleapis.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.worldota.net',
                port: '',
                pathname: '**',
            },
        ],
    }
};

export default nextConfig;

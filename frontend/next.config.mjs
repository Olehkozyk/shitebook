/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        loader: 'custom',
        loaderFile: './my/image/loader.js',
    }
};

export default nextConfig;

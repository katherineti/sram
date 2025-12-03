import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: { loader: 'worker-loader' },
    });
    
    // Configuración para que los workers funcionen también en el servidor
    if (isServer) {
        config.output.globalObject = 'this';
    }
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'albaciudad.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wkf.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.panamsports.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.diariolasamericas.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

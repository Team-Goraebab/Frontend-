import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4C48FF',
        secondary: '#FF4853',
        accent: '#ffad1f',
        danger: '#e0245e',
        header_bg: '#E3E6EA',
        grey_0: '#F4F4F4',
        grey_1: '#E3E6EA',
        grey_2: '#D2D2D2',
        grey_3: '#999999',
        grey_4: '#7F7F7F',
        grey_6: '#4E4E4E',
        blue_1: '#d2d1f6',
        blue_2: '#4C48FF',
        red_1: '#f6d4d6',
        red_2: '#FF4853',
        yellow_1: '#f6e3d1',
        yellow_2: '#FFA048',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // screens: {
      //   sm: 640px 이상
      //   md: 768px 이상
      //   lg: 1024px 이상
      //   xl: 1280px 이상
      //   2xl: 1536px 이상
      //   },
    },
  },
  plugins: [],
};
export default config;

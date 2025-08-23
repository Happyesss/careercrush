/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cape-cod': {
          '10':'#f4f2ee',
          '50': '#f5f8f7',
          '100': '#e0e7e6',
          '200': '#c0cfcc',
          '300': '#99afab',
          '400': '#748d8a',
          '500': '#597370',
          '600': '#465b59',
          '700': '#3b4a49',
          '800': '#364342',
          '900': '#2c3534',
          '950': '#161d1d',
        },
        'blue': {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
        },
      },
      screens: {
        xsm: "350px",
        xs: "476px",
        sm: "640px",
        md: "768px",
        bs: "900px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        // Max-width (responsive down) breakpoints
        "2xl-mx": { max: "1535px" },
        "xl-mx": { max: "1279px" },
        "lg-mx": { max: "1023px" },
        "bs-mx": { max: "900px" },
        "md-mx": { max: "767px" },
        "sm-mx": { max: "639px" },
        "xs-mx": { max: "475px" },
        "xsm-mx": { max: "349px" },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
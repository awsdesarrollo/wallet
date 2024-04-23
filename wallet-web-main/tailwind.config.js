/** @type {import('tailwindcss').Config} */
const {nextui} = require('@nextui-org/react');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D7FF',
        secondary: '#00D7FF',
        red: '#e53935',
        green: '#5dad4a',
        blue: '#1C8CA5',
        orange: '#f56010',
        success: '#01AA00',
        danger: '#FF2929',
        background: '#262450',
        content1: '#262450',
      },
    },
  },
  plugins: [
    nextui({
      prefix: 'w',
      addCommonColors: true,
      defaultTheme: 'dark',
      defaultExtendTheme: 'dark',
      themes: {
        light: {
          primary: '#00D7FF',
          secondary: '#00D7FF',
          red: '#e53935',
          green: '#5dad4a',
          blue: '#1C8CA5',
          orange: '#f56010',
          success: '#01AA00',
          danger: '#FF2929',
          content1: '#262450',
          colors: {
            background: '#262450',
          }
        },
        dark: {
          primary: '#00D7FF',
          secondary: '#00D7FF',
          red: '#e53935',
          green: '#5dad4a',
          blue: '#1C8CA5',
          orange: '#f56010',
          success: '#01AA00',
          danger: '#FF2929',
          content1: '#262450',
          colors: {
            background: '#262450',
          }
        },
      }
    })
  ],
}


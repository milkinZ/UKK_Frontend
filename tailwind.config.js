/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "./node_modules/flowbite/**/*.js",
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: [
      "./node_modules/flowbite/**/*.js",
    ],
  },
  plugins: [
    require('flowbite/plugin'),
    require('tw-elements/dist/plugin')
],
}
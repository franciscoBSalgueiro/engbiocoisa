/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#ffffff",
        beige: "#def2f1",
        accent1: "#3aafa9",
        accent2: "#2B7A78",
        accent3: "#17252a",
        discord: "#5865F2",
        "discord-dark": "#4853C7",
      },
      keyframes: {
        pendulum: {
          "0%, 100%": { transform: "rotate(0deg)", transformOrigin: "100% 0%" },
          "50%": { transform: "rotate(-180deg)", transformOrigin: "100% 0%" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%) scaleX(0.5)" },
          "100%": { transform: "translateX(250%) scaleX(1.7)" },
        },
      },
      animation: {
        pendulum: "pendulum 2s ease-in-out infinite",
        slideIn: "slideIn 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};

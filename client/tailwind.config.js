/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 5px 15px -5px rgba(0, 170, 255, 1)',
        'hover':'0 5px 25px -5px rgba(0, 170, 255, 1)'
      },
      colors: {
        primary: "#3A86FF",
        skyBlue: "#59aef8",
        black: "#1C1C1E",
        grey: "#55555E",
        lightGrey:"rgba(0, 0, 0, 0.05)",
        white:"#FEFEFE",
        realWhite:"#FFF",
        red:"#EA3323",
        lightBlue:"#F1F6FB",
        darkBlue:"#19153d",
        Lime:"#6AD6D7",
        green:"#6BC977",
        violet:"#4B6FF6"
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [require('tailwind-scrollbar'),function({addUtilities}){
    const newUtilities = {
      ".scrollbar-thin" : {
        scrollbarWidth : "thin",
        scrollbarColor : "rgba(31 29 29 0.5) white"
      },
      ".scrollbar-webkit":{
        "&::-webkit-scrolbar" : {
          width: "8px"
        },
        "&::-webkit-scrollbar-track" : {
          backgournd: "white"
        },
        "&::-webkit-scrollbar-track" : {
          
          backgourndColor: "rgb(31 41 55 0.5)",
          borderRadius: "20px",
          border: "1px solid white"
        },          
      }
    }

    addUtilities(newUtilities, ["responsive" , "hover"])
  }],
};
import { extendTheme } from "@chakra-ui/react";

// const colors = {
//   primary: {
//     100: "#2C5282",
//     200: "#2C5282",
//     300: "#2C5282",
//     400: "#2C5282",
//     500: "#2C5282",
//     600: "#2C5282",
//     700: "#2C5282",
//     800: "#2C5282",
//     900: "#2C5282"
//   }
// };

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const customTheme = extendTheme({ config });

export default customTheme;
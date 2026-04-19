"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
        main: "#f89f8e"
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
});

export default theme;
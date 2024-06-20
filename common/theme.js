import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#0057ae",
      light: "#3690F2",
    },
    secondary: {
      main: "#19857b",
    },
    table: {
      title: "#C8E7FF",
      deleteRow: "#ffd5d5",
      changeRow: "#fffcba",
    },
    line: {
      light: "#E4E4E4",
      selected: "#0057ae",
      main: "#c6c6c6",
    },
    text: {
      white: "#f0f8ff",
    },
    menu: {
      color: "#14263e",
      text: "#f0f8ff",
      title: "#848d99",
    },
    calendar: {
      sunday: "#942f2e",
      saturday: "#4484c4",
      weekday: "#000000",
    },
    effect: {
      main: "#ec342e",
      light: "#f37875",
      dark: "b81410",
      contrastText: "#fff",
    },
    add: {
      main: "#000000",
    },
    backgroundColor: "#ebebeb",
  },

  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          margin: 5,
          "&.required": {
            marginLeft: "10px",
          },
        },
      },
    },
  },

  typography: {
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
    h6: {
      fontSize: ".96rem",
      fontWeight: 600,
      "&.underline": {
        paddingBottom: ".4rem",
        borderBottom: "solid 2px",
      },
      "&.bg_full": {
        fontWeight: "100",
        padding: ".6rem",
      },
    },
  },
});

export default theme;

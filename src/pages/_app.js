import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../common/theme";


export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
        <Component {...pageProps} />
    </ThemeProvider>
  );
}

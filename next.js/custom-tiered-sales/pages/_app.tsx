import "../styles/globals.css";
import type { AppProps } from "next/app";

import { FlairProvider } from "@flair-sdk/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FlairProvider>
      <Component {...pageProps} />
    </FlairProvider>
  );
}

export default MyApp;

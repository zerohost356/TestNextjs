import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#f97316" />
          <meta name="color-scheme" content="dark" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="BloxStock" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="application-name" content="BloxStock" />
          <meta name="msapplication-TileColor" content="#f97316" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

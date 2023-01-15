import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js" strategy="beforeInteractive"/>
      <script src="../form.js" strategy="beforeInteractive"/>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

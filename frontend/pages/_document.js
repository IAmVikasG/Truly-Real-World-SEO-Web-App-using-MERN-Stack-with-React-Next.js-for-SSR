import { Html, Head, Main, NextScript } from 'next/document'

export default function MyDocument()
{
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
                />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css" integrity="sha512-DanfxWBasQtq+RtkNAEDTdX4Q6BPCJQ/kexi/RftcP0BcA4NIJPSi7i31Vl+Yl5OCfgZkdJmCqz+byTOIIRboQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="stylesheet" href='/static/css/styles.css' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

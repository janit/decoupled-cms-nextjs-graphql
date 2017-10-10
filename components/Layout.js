import React from "react";
import Head from "next/head";
import Link from "next/link";

export default class Layout extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <style global jsx>{`

            html {
              font-family: "Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
            }


            img {
              width: 640px;
            }


            @media (min-width: 40rem) {

              .wrapper {
                  display: grid;
                  grid-template-columns: auto auto;
                  grid-gap: 2em;    
              }

            }

            .wrapper {
              max-width: 666px;
              margin: 0 auto;
              background-color: #3b64e4;
              color: #fff;
              padding: 2em;
              border-bottom-right-radius: 20px;
              border-bottom-left-radius: 20px;
            }

            .wrapper a {
              color: #fff;
            }

            header img {
            width: 270px; 
            }

            main img {
              max-width: 100%;
              height: auto;
            }

            footer {
              grid-column: 1 / span 2;
              padding: 2em;
              text-align: right;
            }

        `}</style>

        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
          />
          <link
            href="//fonts.googleapis.com/css?family=Raleway:400,300,600"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/images/favicon.ico"
          />
        </Head>
        <header>
          <Link href="/">
            <a>
              <img src="/static/images/react-rauma.png" alt="React Rauma" />
            </a>
          </Link>
        </header>
        <div className="content-wrapper">{this.props.children}</div>
        <footer>
          <p>
            <a href="https://github.com/janit/decoupled-cms-nextjs-graphql">
              View source
            </a>{" "}
            | Webadesign by <a href="https://malloc.fi/">Malloc Industries</a>
          </p>
        </footer>
      </div>
    );
  }
}

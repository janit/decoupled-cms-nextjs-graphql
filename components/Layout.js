import React from "react";
import Head from "next/head";
import Link from "next/link";

export default class Layout extends React.Component {
  render() {
    return (
      <div className="wrapper">
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
          <link rel="stylesheet" href="/static/styles/main.css" />
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

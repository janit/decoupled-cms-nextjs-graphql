import React from "react";
import renderHTML from 'react-render-html';

import Link from "next/link";
import Head from "next/head";

import Layout from "../components/Layout";
import { simplifyFields } from "../lib/contentUtils";

let apiRoot = 'https://v1-11-hbgl5gq-oiiukjqgkij7e.eu.platform.sh';
let rootLocationId = 68;

var client = require("graphql-client")({
  url: apiRoot + "/graphql/"
});

export default class extends React.Component {
  static async getInitialProps({ query: { id } }) {
    let query = `

    {
        content(id: ${id}) {
          name
          fields(identifier: ["title", "body", "main_image"]) {
            fieldDefIdentifier,
            value {
              ... on TextLineFieldValue {
                text
              }
              ... on RichTextFieldValue {
                html5
              }
              ... on ImageFieldValue {
                uri
              }
            }
          }
        }
      }

      `;

    let variables = {};

    return await client.query(query, variables);
  }

  render() {
    let fields = simplifyFields(this.props.data.content.fields);

    return (
      <Layout>
        <Head>
          <title>{fields.title} - React Rauma</title>
        </Head>
        <main>
          <h1>{fields.title}</h1>
          {renderHTML(fields.body)}
          {fields.main_image ? (
            <p>
              <img src={apiRoot + fields.main_image} />
            </p>
          ) : null}
        </main>
        <aside>
          <nav>
            <p>
              <Link href="/">
                <a>Etusivulle</a>
              </Link>
            </p>
          </nav>
        </aside>
      </Layout>
    );
  }
}

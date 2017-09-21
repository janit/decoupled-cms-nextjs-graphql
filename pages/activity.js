import React from "react";
import { flat } from "flat";
import Parser from "html-react-parser";

import Link from "next/link";
import Head from "next/head";

import Layout from "../components/Layout";
import { simplifyFields } from "../lib/contentUtils";

let apiRoot = process.env.APIROOTURL;
let rootLocationId = process.env.ROOTLOCATIONID;

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
          {Parser(fields.body)}
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
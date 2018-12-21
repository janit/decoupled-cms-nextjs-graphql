import React from "react";
import Link from "next/link";
import Head from "next/head";
import renderHTML from 'react-render-html';

import Layout from "../components/Layout";
import Navigation from "../components/Navigation";
import { simplifyFields } from "../lib/contentUtils";

let apiRoot = 'https://api.react.nu';
let rootLocationId = 118;

var client = require("graphql-client")({
  url: apiRoot + "/graphql/graphql/repository"
});

export default class Index extends React.Component {
  static async getInitialProps() {

    let query = `

        {
            frontpage: location(id: ${rootLocationId}) {
              content {
                fields(identifier: ["title", "body"]) {
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
            activities: locationChildren(id: ${rootLocationId}) {
                content {
                  id
                  name
                }
            }
          }

        `;

    let variables = {};

    return await client.query(query, variables);
  }

  render() {

    let fields = simplifyFields(this.props.data.frontpage.content.fields);

    return (
      <Layout>
        <Head>
          <title>{fields.title}</title>
        </Head>
        <main>
          <h1>{fields.title}</h1>
          {renderHTML(fields.body)}
        </main>
        <aside>
          <Navigation title="Ohjelmaa" items={this.props.data.activities} />
        </aside>
      </Layout>
    );
  }
}

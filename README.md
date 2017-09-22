
# Decoupled CMS example with GraphQL and Next.js

This repository contains the source code for the sample application from the talk "Easy decoupled sitebuilding with <a href="https://graphql.org">GraphQL</a> and <a href="github.com/zeit/next.js/">Next.js</a>" held in September 2017 at Drupalcon Vienna and Helsinki.js Meetup.

The application is an example of a front end implementation decoupled from the CMS backend used for content storage only. This example uses a hosted <a href="http://ezplatform.com">eZ Platform</a> instance with GraphQL enabled using the <a href="https://github.com/bdunogier/ezplatform-graphql-bundle">GraphQL Bundle</a>. This API is consumed by a Next.js frontend that uses React.js for templating and handles Server Side Rendering (SSR), etc. boilerplate.

The application is online at https://react.nu/ slides for the presentation are available online here: https://janit.iki.fi/cms-graphql-nextjs


## Installation

The application can be ran either using NPM scripts in development and production mode, as per documentation of Next.js.

If you've got a recent Node.js and Yarn versions installed, you should be able to do this for development mode:

```
$ yarn
$ npm run dev
```

After that the app is available in http://localhost:3000/ . The first click is server generated, but subsequent pageloads are done by the browser using the GraphQL.

For production mode you'll need to perform a build and then serve:

```
$ yarn
$ npm run build
$ npm run start
```
### Docker deployment

Alternatively you can use Docker to host the application. Once you have Docker installed, perform the build from the Dockerfile and then run the image:

```
docker build -t react_rauma .
docker run -p 3000:3000 -d --name=react_rauma --restart=always react_rauma
```

This will make the container run and restart the upon crash or a reboot. The app is again running in port 3000 on localhost.

## Application description

### Simple static page

The application uses a standard Next.js structure, with entrypoints in the pages-directory.

The most simple example is the about page, which is a stateless React component:

```
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/Layout'

export default () => (
  <Layout>
    <Head>
      <title>Tietoa maailman suurimmasta suomenkielisestä React.js-konferenssista</title>
    </Head>
    <main>
      <h1>Maailman suurin suomalainen React.js-konfferenssi</h1>
      <p>Onks tää joku vitsi?! No tavallaan.</p>
    </main>
    <aside>
        <Link href="/"><a>Etusivulle</a></Link>
    </aside>
  </Layout>
);
```

The above file in `pages/about.js` automatically maps to the address http://localhost:3000/pages/about.js

Note the `Link` component which can be used to provide navigation from page to page in your application.

## Serving the front page from eZ Platform GraphQL API

The eZ Platform repository has a tree structure of content, which we will get the parent page and some properties from the child location "activity" objects for navigation with a single GraphQL query:

 - Content
    - frontpage
        - fields
            - title
            - body
            - main_image
    - activities
        - activity 1
            - id
            - name
        - activity 2
            - id
            - name
        - activity 3
            - id
            - name
        - ...


To  get content from the eZ Platform repository using the GraphQL API we need a class that has the `getInitialProps` method that will perform a GraphQL query (in pages/index.js).

The GraphQL query in the call is using eZ Platform content repository Public API via the GraphQL Bundle. The `rootLocationId` is a configuration value set in `.env`:

```
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

let variables = {
    query: "Search Query",
};

return await client.query(query, variables);
}
```




The result is set as `props` to the component and is rendered in the render function:

```
render() {
    let fields = simplifyFields(this.props.data.frontpage.content.fields);

    return (
        <Layout>
        <Head>
            <title>{fields.title}</title>
        </Head>
        <main>
            <h1>{fields.title}</h1>
            {Parser(fields.body)}
        </main>
        <aside>
            <Navigation title="Ohjelmaa" items={this.props.data.activities} />
        </aside>
        </Layout>
    );
}
```

Note the use of some helpers to simplify the field structure to ease use, the Parse function to enable HTML output and the Navigation component that could be reused from page to page.

## Passing parameters to a view

To pass parameters to the script to enable URL specific content for URLs, we will need to run a custom server script and pass URL params to it.

The script is based on the example from the Next.js repository. It only matches URLs with the pattern `/activity/:id` and can be seen below:

```
const match = route("/activity/:id");

app.prepare().then(() => {
  createServer((req, res) => {
    const { pathname, query } = parse(req.url, true);
    const params = match(pathname);
    if (params === false) {
      handle(req, res);
      return;
    }
    app.render(req, res, "/activity", Object.assign(params, query));
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

This script defined to be used via NPM scripts in package JSON when serving the app:

```
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  },
```

Note that you could use Express, Koa or other Node.js frameworks to process request routing, etc. with Next.js.

Now that we've got access to URL variables, let's take a look at `pages/activity.js` which is our entrypoint to the view displaying individual activities.

First off the `getInitialProps` method contains a GraphQL query, but it's using the dynamic variable via the ES6 template literal format (${id}):

```
static async getInitialProps({ query: { id } }) {
let query = `

    {
    content(id: ${id}) {
        name
        fieldDefIdentifier,
        fields(identifier: ["title", "body", "main_image"]) {
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

```

Secondly, the `render` method is familiar to the one from `pages/index.js`:

```
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
```

### Linking to dynamic pages

In the navigation component we are linking to individual pages. Here you use the Next.js provided `Link` component that will handle the core linking functionality with the `href` attribute.

What is noteworthy is the `as` attribute that allows aliasing paths to be displayed as `/activity/123` instead of with parameters, e.g. `/activity?id=123`. Otherwise the link generation is inline with standard JSX/Next.js methods:

```
<ul>
{items.map(item => (
<li key={item.content.id}>
    <Link
    href={"/activity?id=" + item.content.id}
    as={"activity/" + item.content.id}
    >
    <a>{item.content.name}</a>
    </Link>
</li>
))}
</ul>
```

Note: In our case the GraphQL backend does not currently expose loading content objects by URL Aliases (e.g. /this/is/my/page), so our URLs end up being in the format `http://example.com/activities/123`, but the `id` parameter could just as well be called something like `slug` or `path` and allow pretty URLs to content views.

import Link from 'next/link'
import Head from 'next/head'

import Layout from '../components/Layout'

export default () => (
  <Layout>
    <Head>
      <title>Tietoa maailman suurimmasta Suomenkielisestä React -konferenssista</title>
    </Head>
    <main>
      <h1>Tietoa maailman suurimmasta Suomenkielisestä React -konferenssista</h1>
      <p>Onks tää joku vitsi?! No tavallaan.</p>
    </main>
    <aside>
        <Link href="/"><a>Etusivulle</a></Link>
    </aside>
  </Layout>
);

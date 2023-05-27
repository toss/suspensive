// eslint-disable import/no-unresolved
import React from 'react'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import styles from './index.module.css'

const HomepageHeader = () => (
  <header className={clsx(styles.heroBanner)}>
    <div className="container">
      <img src="img/logo_notcropped.png" alt="logo" style={{ height: 180, width: 180, marginBottom: -16 }} />
      <h1 className="hero__title">Suspensive</h1>
      <p className="hero__subtitle">
        <Translate>Declarative components to use suspense for React</Translate>
      </p>
      <div className={styles.buttons}>
        <Link className="button button--secondary button--lg" to="/docs/intro/motivation.i18n">
          <Translate>Get started</Translate>
        </Link>
      </div>
    </div>
  </header>
)

const Home = () => (
  <Layout>
    <HomepageHeader />
    <main>
      <HomepageFeatures />
    </main>
  </Layout>
)

export default Home

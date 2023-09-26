import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'
import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'

const HomepageHeader = () => (
  <header className={clsx(styles.heroBanner)}>
    <div className="container">
      <img
        src="img/logo_background_star.png"
        alt="logo"
        style={{
          width: 348,
          marginBottom: 30,
        }}
      />
      <h1 className="hero__title">Suspensive</h1>
      <p className="hero__subtitle">
        <Translate>Packages to use React Suspense easily</Translate>
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

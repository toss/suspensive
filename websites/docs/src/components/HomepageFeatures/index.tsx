import React from 'react'
import Translate from '@docusaurus/Translate'
import clsx from 'clsx'
import styles from './styles.module.css'

type FeatureItem = {
  title: JSX.Element
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: <Translate>All Declarative Boundaries ready</Translate>,
    description: (
      <Translate>
        Suspense, ErrorBoundary, AsyncBoundary, ErrorBoundaryGroup is provided. You can use them easily without any
        efforts
      </Translate>
    ),
  },
  {
    title: <Translate>Zero peer dependency, Only React</Translate>,
    description: (
      <Translate>
        It is simply extensions of react's concepts. Named friendly with originals like just Suspense, ErrorBoundary,
        AsyncBoundary
      </Translate>
    ),
  },
  {
    title: <Translate>Suspense in SSR easily</Translate>,
    description: (
      <Translate>
        Suspensive provide CSROnly mode that make developer can adopt Suspense gradually in Server-side rendering
        environment
      </Translate>
    ),
  },
]

const Feature = ({ title, description }: FeatureItem) => (
  <div className={clsx('col col--4')}>
    <div className="text--center padding-horiz--md">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
)

const HomepageFeatures = () => (
  <section className={styles.features}>
    <div className="container">
      <div className="row">
        {FeatureList.map((props, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  </section>
)

export default HomepageFeatures

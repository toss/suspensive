import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  description: string
}

const FeatureList: FeatureItem[] = [
  {
    title: 'All Declarative Boundaries ready',
    description:
      'Suspense, ErrorBoundary, AsyncBoundary with ResetKey or CSROnly mode is provided. You can use them easily without any efforts',
  },
  {
    title: 'Zero peer dependency, Only React',
    description:
      "It is simply extensions of react's concepts. Named friendly with originals like just Suspense, ErrorBoundary, AsyncBoundary",
  },
  {
    title: 'Suspense in SSR easily',
    description:
      'Suspensive provide CSROnly mode that make developer can adopt Suspense gradually in Server-side rendering environment',
  },
]

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

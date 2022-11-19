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
      'AsyncBoundary, ErrorBoundary, ResetErrorBoundary, Suspense is provided. You can use them easily without any efforts',
  },
  {
    title: 'Only peer dependency, React',
    description:
      "It is simply extension of react's concepts. friendly name like Suspense, Error/Async/ResetBoundary",
  },
  {
    title: 'Support Sever-side rendering',
    description:
      "React Boundary provide SSRSafe apis that supports Server-side rendering that wrap react's Suspense",
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

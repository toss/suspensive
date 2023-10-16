import React from 'react'

export const HomePage = ({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: { title: string; desc: string }[]
}) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          paddingTop: 70,
        }}
      >
        <img src="/img/logo_background_star.png" alt="Suspensive with star" width={400} height={300} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 28,
            }}
          >
            {description}
          </p>
        </div>

        <a href="/docs/why">
          <button
            style={{
              backgroundColor: '#00000013',
              fontSize: 24,
              fontWeight: 700,
              borderRadius: 12,
              padding: '12px 50px',
            }}
          >
            시작하기
          </button>
        </a>
      </div>

      <div style={{ height: 60 }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        {items.map(({ title, desc }) => (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: 12,
            }}
            key={title}
          >
            <h3
              style={{
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: 18,
              }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

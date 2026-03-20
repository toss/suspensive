'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  queryOptions,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as d3 from 'd3'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

const contributorsQueryOptions = () =>
  queryOptions({
    queryKey: ['contributors'],
    queryFn: () =>
      fetch(
        'https://api.github.com/repos/toss/suspensive/stats/contributors'
      ).then(async (res) => {
        if (res.ok) {
          const data = await res.json()

          return data as
            | {
                author: {
                  login: string
                  id: number
                  node_id: string
                  avatar_url: string
                  gravatar_id: string
                  url: string
                  html_url: string
                  followers_url: string
                  following_url: string
                  gists_url: string
                  starred_url: string
                  subscriptions_url: string
                  organizations_url: string
                  repos_url: string
                  events_url: string
                  received_events_url: string
                  type: string
                  site_admin: boolean
                }
                total: number
                weeks: {
                  w: number // Week timestamp in epoch seconds
                  a: number // Number of additions
                  d: number // Number of deletions
                  c: number // Number of commits
                }[]
              }[]
            | Record<never, never>
            | undefined
        }
        throw new Error('Failed to fetch contributors')
      }),
  })

export const BubbleChart = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallback={
              <Link href="https://github.com/toss/suspensive/graphs/contributors">
                <br />
                <img
                  src="https://contrib.rocks/image?repo=toss/suspensive"
                  alt="contributors"
                  data-canonical-src="https://contrib.rocks/image?repo=toss/suspensive"
                  style={{ maxWidth: '100%' }}
                />
              </Link>
            }
          >
            <Suspense clientOnly fallback={<></>}>
              <SuspenseQuery {...contributorsQueryOptions()}>
                {({ data }) => {
                  if (!data || !('filter' in data)) {
                    throw new Error('Failed to fetch contributors')
                  }

                  const chartData = data
                    .filter(
                      ({ author }) =>
                        ![
                          'github-actions[bot]',
                          'dependabot[bot]',
                          'renovate[bot]',
                        ].includes(author.login)
                    )
                    .map(({ author, total }) => ({
                      name: author.login,
                      value: total,
                      avatar: author.avatar_url,
                      htmlUrl: author.html_url,
                    }))

                  return (
                    <>
                      <div className="flex w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:hidden">
                        <BubbleChartSize
                          chartData={chartData}
                          height={400}
                          width={400}
                          padding={2}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:flex md:hidden lg:hidden">
                        <BubbleChartSize
                          chartData={chartData}
                          height={630}
                          width={630}
                          padding={6}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:flex lg:hidden">
                        <BubbleChartSize
                          chartData={chartData}
                          height={560}
                          width={560}
                          padding={4}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:flex">
                        <BubbleChartSize
                          chartData={chartData}
                          height={760}
                          width={760}
                          padding={8}
                        />
                      </div>
                    </>
                  )
                }}
              </SuspenseQuery>
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

type Node = {
  name: string
  value: number
  avatar: string
  htmlUrl: string
  children?: Node[]
}
const BubbleChartSize = (props: {
  chartData: Array<Node>
  width: number
  height: number
  padding: number
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!props.chartData.length) return

    const root = d3
      .hierarchy({ children: props.chartData } as Node)
      .sum((d: Node) => (d.value < 100 ? d.value : 100) + 3)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    const pack = d3
      .pack()
      .size([props.width, props.height])
      .padding(props.padding)

    const nodes = pack(root).descendants().slice(1)

    const svg = d3
      .select(svgRef.current)
      .attr('width', props.width)
      .attr('height', props.height)
      .style('display', 'block')
      .style('margin', 'auto')
      .style('overflow', 'visible')

    const nodeGroups = svg
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: d3.HierarchyCircularNode<Node>) => {
        if (d.data.htmlUrl) {
          window.location.href = d.data.htmlUrl
        }
      })
      .on('mouseover', function () {
        d3.select(this).select('image').style('opacity', 0.8)
      })
      .on('mouseout', function () {
        d3.select(this).select('image').style('opacity', 1)
      })

    nodeGroups
      .append('image')
      .attr('x', (d) => -d.r * 1)
      .attr('y', (d) => -d.r * 1)
      .attr('width', (d) => d.r * 2)
      .attr('height', (d) => d.r * 2)
      .attr('href', (d: d3.HierarchyCircularNode<Node>) => d.data.avatar)
      .attr(
        'clip-path',
        (d) => `circle(${d.r * 1}px at ${d.r * 1}px ${d.r * 1}px)`
      )
  }, [props.chartData, props.height, props.width, props.padding])

  return <svg ref={svgRef} />
}

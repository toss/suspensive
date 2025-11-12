'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-4'
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  queryOptions,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

// List of Suspensive packages to track
const SUSPENSIVE_PACKAGES = [
  '@suspensive/react',
  '@suspensive/react-query',
  '@suspensive/react-query-4',
  '@suspensive/react-query-5',
  '@suspensive/react-dom',
  '@suspensive/react-native',
  '@suspensive/next',
  '@suspensive/jotai',
  '@suspensive/codemods',
]

type PackageDownloads = {
  package: string
  downloads: number
}

const fetchPackageDownloads = async (
  packageName: string
): Promise<PackageDownloads> => {
  // Use the npm registry API to get download stats for the last month
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch downloads for ${packageName}`)
  }
  const data = await response.json()
  return {
    package: packageName,
    downloads: data.downloads || 0,
  }
}

const usageQueryOptions = () =>
  queryOptions({
    queryKey: ['package-downloads'],
    queryFn: async () => {
      const results = await Promise.all(
        SUSPENSIVE_PACKAGES.map((pkg) => fetchPackageDownloads(pkg))
      )
      return results
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })

export const UsageChart = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
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
              <div className="flex min-h-[400px] w-full items-center justify-center text-center">
                <p className="text-sm opacity-75">
                  Failed to load download statistics. Please try again later.
                </p>
              </div>
            }
          >
            <Suspense clientOnly fallback={<></>}>
              <SuspenseQuery {...usageQueryOptions()}>
                {({ data }) => {
                  if (data.length === 0) {
                    throw new Error('No download data available')
                  }

                  // Sort by downloads descending
                  const sortedData = [...data].sort(
                    (a, b) => b.downloads - a.downloads
                  )

                  return (
                    <>
                      <div className="flex w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:hidden">
                        <BarChart data={sortedData} width={350} height={400} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:flex md:hidden lg:hidden">
                        <BarChart data={sortedData} width={600} height={450} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:flex lg:hidden">
                        <BarChart data={sortedData} width={700} height={500} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:flex">
                        <BarChart data={sortedData} width={800} height={550} />
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

type BarChartProps = {
  data: PackageDownloads[]
  width: number
  height: number
}

const BarChart = ({ data, width, height }: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (data.length === 0) return

    const margin = { top: 20, right: 30, bottom: 80, left: 80 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block')
      .style('margin', 'auto')

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.package.replace('@suspensive/', '')))
      .range([0, chartWidth])
      .padding(0.2)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.downloads) || 0])
      .nice()
      .range([chartHeight, 0])

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.package.replace('@suspensive/', '')) || 0)
      .attr('y', (d) => y(d.downloads))
      .attr('width', x.bandwidth())
      .attr('height', (d) => chartHeight - y(d.downloads))
      .attr('fill', 'rgb(59, 130, 246)')
      .attr('opacity', 0.8)
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 1)
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.8)
      })

    // Add value labels on top of bars
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr(
        'x',
        (d) =>
          (x(d.package.replace('@suspensive/', '')) || 0) + x.bandwidth() / 2
      )
      .attr('y', (d) => y(d.downloads) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', '12px')
      .text((d) => d.downloads.toLocaleString())

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('fill', 'currentColor')

    // Add Y axis
    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => (d as number).toLocaleString())
      )
      .selectAll('text')
      .attr('fill', 'currentColor')

    // Add Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - chartHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', '14px')
      .text('Downloads (Last Month)')

    // Style axis lines
    svg
      .selectAll('.domain, .tick line')
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.3)
  }, [data, width, height])

  return <svg ref={svgRef} />
}

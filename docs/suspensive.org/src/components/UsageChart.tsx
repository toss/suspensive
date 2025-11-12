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

type TimeSeriesData = {
  date: string
  downloads: number
}

type PackageTimeSeriesResponse = {
  package: string
  downloads: Array<{
    downloads: number
    day: string
  }>
}

const fetchPackageTimeSeries = async (
  packageName: string
): Promise<PackageTimeSeriesResponse> => {
  // Fetch last 6 months of data for better growth curve visualization
  const response = await fetch(
    `https://api.npmjs.org/downloads/range/last-6-months/${packageName}`
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch downloads for ${packageName}`)
  }
  const data = (await response.json()) as PackageTimeSeriesResponse
  return data
}

const usageQueryOptions = () =>
  queryOptions({
    queryKey: ['package-downloads-timeseries'],
    queryFn: async () => {
      // Fetch time series data for all packages
      const results = await Promise.all(
        SUSPENSIVE_PACKAGES.map((pkg) => fetchPackageTimeSeries(pkg))
      )

      // Aggregate downloads by date across all packages
      const dateMap = new Map<string, number>()

      results.forEach((packageData) => {
        packageData.downloads.forEach((day) => {
          const currentTotal = dateMap.get(day.day) || 0
          dateMap.set(day.day, currentTotal + day.downloads)
        })
      })

      // Convert to array and sort by date
      const timeSeriesData: TimeSeriesData[] = Array.from(dateMap.entries())
        .map(([date, downloads]) => ({ date, downloads }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      return timeSeriesData
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

                  return (
                    <>
                      <div className="flex w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:hidden">
                        <LineChart data={data} width={350} height={400} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:flex md:hidden lg:hidden">
                        <LineChart data={data} width={600} height={450} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:flex lg:hidden">
                        <LineChart data={data} width={700} height={500} />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:flex">
                        <LineChart data={data} width={800} height={550} />
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

type LineChartProps = {
  data: TimeSeriesData[]
  width: number
  height: number
}

const LineChart = ({ data, width, height }: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (data.length === 0) return

    const margin = { top: 20, right: 30, bottom: 50, left: 80 }
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

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d')
    const parsedData = data.map((d) => ({
      date: parseDate(d.date) as Date,
      downloads: d.downloads,
    }))

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([0, chartWidth])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.downloads) || 0])
      .nice()
      .range([chartHeight, 0])

    // Create line generator
    const line = d3
      .line<{ date: Date; downloads: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.downloads))
      .curve(d3.curveMonotoneX)

    // Add gradient for area under curve
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(d3.max(parsedData, (d) => d.downloads) || 0))

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(59, 130, 246)')
      .attr('stop-opacity', 0.3)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(59, 130, 246)')
      .attr('stop-opacity', 0.05)

    // Create area generator
    const area = d3
      .area<{ date: Date; downloads: number }>()
      .x((d) => x(d.date))
      .y0(chartHeight)
      .y1((d) => y(d.downloads))
      .curve(d3.curveMonotoneX)

    // Add area
    g.append('path')
      .datum(parsedData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area)

    // Add line
    g.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(59, 130, 246)')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width > 600 ? 8 : 4)
          .tickFormat((d) => d3.timeFormat('%b %Y')(d as Date))
      )
      .selectAll('text')
      .attr('fill', 'currentColor')

    // Add Y axis
    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => {
            const num = d as number
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
            if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
            return num.toLocaleString()
          })
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
      .text('Total Downloads')

    // Style axis lines
    svg
      .selectAll('.domain, .tick line')
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.3)
  }, [data, width, height])

  return <svg ref={svgRef} />
}

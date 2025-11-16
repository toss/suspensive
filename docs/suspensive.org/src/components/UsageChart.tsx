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

type GitHubStats = {
  stars: number
  forks: number
  watchers: number
}

type StatsData = {
  timeSeriesData: TimeSeriesData[]
  totalDownloads: number
  githubStats: GitHubStats
}

const fetchPackageTimeSeries = async (
  packageName: string
): Promise<PackageTimeSeriesResponse> => {
  const response = await fetch(
    `https://api.npmjs.org/downloads/range/last-year/${packageName}`
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch downloads for ${packageName}`)
  }
  const data = (await response.json()) as PackageTimeSeriesResponse
  return data
}

const fetchGitHubStats = async (): Promise<GitHubStats> => {
  const response = await fetch('https://api.github.com/repos/toss/suspensive')
  if (!response.ok) {
    throw new Error('Failed to fetch GitHub stats')
  }
  const data = await response.json()
  return {
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    watchers: data.subscribers_count || 0,
  }
}

const usageQueryOptions = () =>
  queryOptions({
    queryKey: ['package-stats'],
    queryFn: async () => {
      // Fetch time series data for all packages and GitHub stats in parallel
      const [results, githubStats] = await Promise.all([
        Promise.all(
          SUSPENSIVE_PACKAGES.map((pkg) => fetchPackageTimeSeries(pkg))
        ),
        fetchGitHubStats(),
      ])

      // Aggregate downloads by month across all packages
      const monthMap = new Map<string, number>()
      let totalDownloads = 0

      results.forEach((packageData) => {
        packageData.downloads.forEach((day) => {
          // Extract year-month from the date (e.g., "2024-01" from "2024-01-15")
          const yearMonth = day.day.substring(0, 7)
          const currentTotal = monthMap.get(yearMonth) || 0
          monthMap.set(yearMonth, currentTotal + day.downloads)
          totalDownloads += day.downloads
        })
      })

      // Convert to array and sort by date
      const timeSeriesData: TimeSeriesData[] = Array.from(monthMap.entries())
        .map(([date, downloads]) => ({ date, downloads }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const statsData: StatsData = {
        timeSeriesData,
        totalDownloads,
        githubStats,
      }

      return statsData
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
                  if (data.timeSeriesData.length === 0) {
                    throw new Error('No download data available')
                  }

                  return (
                    <div className="w-full space-y-8">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <a
                          href="https://www.npmjs.com/org/suspensive"
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {data.totalDownloads.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              NPM Downloads (Last Year)
                            </div>
                          </div>
                        </a>

                        <a
                          href="https://github.com/toss/suspensive"
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-yellow-500"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <svg
                              className="h-6 w-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {data.githubStats.stars.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Stars on GitHub
                            </div>
                          </div>
                        </a>

                        <a
                          href="https://github.com/toss/suspensive/network/dependents"
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {data.githubStats.watchers.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Watchers on GitHub
                            </div>
                          </div>
                        </a>
                      </div>

                      {/* Chart */}
                      <div className="flex w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:hidden">
                        <LineChart
                          data={data.timeSeriesData}
                          width={350}
                          height={400}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:flex md:hidden lg:hidden">
                        <LineChart
                          data={data.timeSeriesData}
                          width={600}
                          height={450}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:flex lg:hidden">
                        <LineChart
                          data={data.timeSeriesData}
                          width={700}
                          height={500}
                        />
                      </div>
                      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:flex">
                        <LineChart
                          data={data.timeSeriesData}
                          width={800}
                          height={550}
                        />
                      </div>
                    </div>
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

    // Parse dates - handle both YYYY-MM (monthly) and YYYY-MM-DD (daily) formats
    const parseDate = d3.timeParse('%Y-%m')
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

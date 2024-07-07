import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
import useFetchContributors from '../lib/hooks/useFetchContributors'

type Node = {
  name: string
  value: number
  avatar: string
  htmlUrl: string
  children?: Node[]
}

export const BubbleChart = () => {
  const result = useFetchContributors()

  if (!result.isSuccess) {
    return null
  }

  const chartData = result.data.map((contributor) => ({
    name: contributor.author.login,
    value: contributor.total,
    avatar: contributor.author.avatar_url,
    htmlUrl: contributor.author.html_url,
  }))

  return (
    <>
      <div className="flex w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:hidden">
        <BubbleChartSize chartData={chartData} height={400} width={400} padding={2} />
      </div>
      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:flex md:hidden lg:hidden">
        <BubbleChartSize chartData={chartData} height={630} width={630} padding={6} />
      </div>
      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:flex lg:hidden">
        <BubbleChartSize chartData={chartData} height={560} width={560} padding={4} />
      </div>
      <div className="hidden w-[100%] items-center justify-center overflow-visible sm:hidden md:hidden lg:flex">
        <BubbleChartSize chartData={chartData} height={760} width={760} padding={8} />
      </div>
    </>
  )
}

const BubbleChartSize = (props: { chartData: Array<Node>; width: number; height: number; padding: number }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!props.chartData.length) return

    const root = d3
      .hierarchy({ children: props.chartData } as Node)
      .sum((d: Node) => (d.value < 100 ? d.value : 100) + 3)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    const pack = d3.pack().size([props.width, props.height]).padding(props.padding)

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
      .attr('clip-path', (d) => `circle(${d.r * 1}px at ${d.r * 1}px ${d.r * 1}px)`)
  }, [props.chartData, props.height, props.width])

  return <svg ref={svgRef} />
}

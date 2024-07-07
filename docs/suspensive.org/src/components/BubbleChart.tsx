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
  const contributors = useFetchContributors()

  const data = Array.from({ length: contributors.length }, (_, index) => ({
    name: contributors[index]?.author.login,
    value: contributors[index]?.total,
    avatar: contributors[index]?.author.avatar_url,
    htmlUrl: contributors[index]?.author.html_url,
  }))

  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!data.length) return

    const root = d3
      .hierarchy({ children: data } as Node)
      .sum((d: Node) => d.value)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    const pack = d3.pack().size([500, 500]).padding(10)

    const nodes = pack(root).descendants().slice(1)

    const svg = d3
      .select(svgRef.current)
      .attr('width', 500)
      .attr('height', 500)
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
        d3.select(this).select('circle').style('fill', '#ffffff20')
        d3.select(this).select('image').style('opacity', 0.8)
      })
      .on('mouseout', function () {
        d3.select(this).select('circle').style('fill', '#ffffff10')
        d3.select(this).select('image').style('opacity', 1)
      })

    nodeGroups
      .append('circle')
      .attr('r', (d) => d.r)
      .style('fill', '#ffffff10')
      .style('stroke-width', '2px')

    nodeGroups
      .append('image')
      .attr('x', (d) => -d.r * 0.45)
      .attr('y', (d) => -d.r * 0.45)
      .attr('width', (d) => d.r)
      .attr('height', (d) => d.r)
      .attr('href', (d: d3.HierarchyCircularNode<Node>) => d.data.avatar)
      .attr('clip-path', (d) => `circle(${d.r * 0.45}px at ${d.r * 0.45}px ${d.r * 0.45}px)`)
  }, [data])

  return <svg ref={svgRef}></svg>
}

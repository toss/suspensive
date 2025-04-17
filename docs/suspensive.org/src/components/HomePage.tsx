'use client'

import { ClientOnly, Delay } from '@suspensive/react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useEffect, useRef } from 'react'
import { BorderTrail } from './BorderTrail'
import { GlowEffect } from './GlowEffect'
import { Magnetic } from './Magnetic'
import { NpmInstallCopyButton } from './NpmInstallCopyButton'
import { Spotlight } from './Spotlight'
import { TextShimmer } from './TextShimmer'
import { Tilt } from './Tilt'

const CodeBlockClassName = 'nextra-code'

const escapeHtml = (text: string) =>
  text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`)

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc))

export const HomePage = ({
  title,
  buttonText,
  items,
  children,
}: {
  title: string
  buttonText: string
  items: { title: string; desc: string }[]
  version: number
  children?: ReactNode
}) => {
  return (
    <>
      <ClientOnly>
        <StarCanvasFar />
        <StarCanvasClose />
      </ClientOnly>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="-mx-12 -mt-4 bg-[url('/img/homepage_background.svg')] bg-cover bg-center bg-no-repeat px-10 pb-20"
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="width-[360px] height-[360px] -mb-4 hidden md:block">
              <Image
                src="/img/homepage_logo.png"
                alt="Suspensive with star"
                width={360}
                height={360}
              />
            </div>
            <div className="width-[210px] height-[210px] -mb-4 md:hidden md:h-auto md:w-auto">
              <Image
                src="/img/homepage_logo.png"
                alt="Suspensive with star"
                width={210}
                height={210}
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl leading-tight font-bold break-keep text-transparent md:text-6xl">
                <TextShimmer spread={8} duration={3}>
                  {title}
                </TextShimmer>
              </div>
            </div>
            <Magnetic intensity={0.4} springOptions={{ bounce: 0.1 }}>
              <NpmInstallCopyButton />
            </Magnetic>
          </div>

          <Delay ms={600}>
            {({ isDelayed }) => (
              <div
                className="relative"
                style={{
                  opacity: isDelayed ? 1 : 0,
                  transition: 'opacity 200ms ease-in-out',
                }}
              >
                <GlowEffect />
                <Magnetic intensity={0.3} springOptions={{ bounce: 0.1 }}>
                  <Tilt rotationFactor={10} isReverse>
                    <Link href={`/docs/react/motivation`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: 1.01 }}
                        type="button"
                        className="cursor-pointer rounded-xl bg-[#000000] px-7 py-2 text-lg font-semibold text-[ffffff80] md:px-7 md:py-3 md:text-xl"
                      >
                        <BorderTrail
                          size={200}
                          style={{
                            boxShadow:
                              '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
                          }}
                        />
                        <Spotlight
                          className="blur-4xl bg-zinc-700"
                          size={64}
                          springOptions={{
                            bounce: 0.3,
                            duration: 0.1,
                          }}
                        />
                        <Magnetic
                          intensity={0.04}
                          springOptions={{ bounce: 0.1 }}
                          actionArea="global"
                          range={300}
                        >
                          <span className="flex items-center gap-2">
                            {buttonText} <ArrowRight className="h4 w-4" />
                          </span>
                        </Magnetic>
                      </motion.button>
                    </Link>
                  </Tilt>
                </Magnetic>
              </div>
            )}
          </Delay>
        </div>

        <div className="h-14" />
        <div className="container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row">
          {items.map(({ title, desc }, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.2 + index * 0.05, duration: 1 },
              }}
              className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
              key={title}
            >
              <div className="text-lg font-bold md:text-xl">{title}</div>
              <p
                className="text-sm opacity-75 md:text-lg"
                dangerouslySetInnerHTML={{ __html: formatCodeBlocks(desc) }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.2 }}
        className="container"
      >
        {children}
      </motion.section>
    </>
  )
}

interface Vertex {
  pos: number[]
  velocity: number[]
  distance: number
  size: number
}

const TILE = 80
const OFFSET_FACTOR = 0.75
const RANDOM_Z_FACTOR = 2
const VELOCITY_CONSTANT = 8
const RANDOM_DISTANCE_MAX = 900
const RANDOM_SIZE_FACTOR = 2

const StarCanvasFar = () => {
  const animationFrameIdRef = useRef<number | null>(null)
  const resizeAnimationFrameIdRef = useRef(0)
  const onRenderRef = useRef<VoidFunction | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parentElement = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const vertexMap: Record<string, Vertex> = {}
    const startTime = Date.now()

    function getVertex(sx: number, sy: number): Vertex {
      const id = `${sx}x${sy}`

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!vertexMap[id]) {
        const x = TILE * sx + TILE * 1.5 * Math.random() - TILE * OFFSET_FACTOR
        const y = TILE * sy + TILE * 1.5 * Math.random() - TILE * OFFSET_FACTOR
        const z = Math.random() * RANDOM_Z_FACTOR
        const vx = 1 + Math.random() * VELOCITY_CONSTANT
        const vy = 1 + Math.random() * VELOCITY_CONSTANT
        const distance = 10 + Math.random() * RANDOM_DISTANCE_MAX
        const size = 0.1 + Math.random() * RANDOM_SIZE_FACTOR

        vertexMap[id] = {
          pos: [x, y, z],
          velocity: [vx, vy],
          size,
          distance,
        }
      }
      return vertexMap[id]
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0
      const height = canvas?.height ?? 0
      const distTime = Date.now() - startTime

      ctx?.clearRect(0, 0, width, height)

      const maxSX = Math.ceil(width / TILE)
      const maxSY = Math.ceil(height / TILE)

      for (let sx = 0; sx <= maxSX; ++sx) {
        for (let sy = 0; sy <= maxSY; ++sy) {
          const { velocity, distance, pos, size } = getVertex(sx, sy)
          const scalar = Math.sqrt(
            velocity[0] * velocity[0] + velocity[1] * velocity[1]
          )
          const totalDistance = (distTime * scalar) / 1000
          const isReverse = Math.floor(totalDistance / distance) % 2 !== 0
          let nextDistance = totalDistance % distance

          if (isReverse) {
            nextDistance = distance - nextDistance
          }
          const x = pos[0] + (nextDistance / scalar) * velocity[0]
          const y = pos[1] + (nextDistance / scalar) * velocity[1]
          const a = 1 - pos[2]

          ctx?.beginPath()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx!.fillStyle = `rgba(255, 255, 255, ${a})`
          ctx?.arc(x, y, size, 0, 2 * Math.PI)
          ctx?.fill()
        }
      }
    }
    const observer = new ResizeObserver(() => {
      const inlineSize = parentElement?.offsetWidth ?? 0
      const blockSize = parentElement?.offsetHeight ?? 0

      cancelAnimationFrame(resizeAnimationFrameIdRef.current)
      resizeAnimationFrameIdRef.current = requestAnimationFrame(() => {
        if (canvas) {
          canvas.width = inlineSize
          canvas.height = blockSize
          canvas.style.cssText += `width: ${inlineSize}px; height: ${blockSize}px;`
          onRenderRef.current?.()
        }
      })
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    parentElement && observer.observe(parentElement)

    return () => {
      cancelAnimationFrame(resizeAnimationFrameIdRef.current)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const requestAnimation = () => {
      onRenderRef.current?.()
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation)
    }

    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation)
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 opacity-70"
    />
  )
}

const TILE_CLOSE = 600

const StarCanvasClose = () => {
  const animationFrameIdRef = useRef<number | null>(null)
  const resizeAnimationFrameIdRef = useRef(0)
  const onRenderRef = useRef<VoidFunction | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parentElement = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const vertexMap: Record<string, Vertex> = {}
    const startTime = Date.now()

    function getVertex(sx: number, sy: number): Vertex {
      const id = `${sx}x${sy}`

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!vertexMap[id]) {
        const x =
          TILE_CLOSE * sx + TILE_CLOSE * 1.5 * Math.random() - TILE_CLOSE * 0.75
        const y =
          TILE_CLOSE * sy + TILE_CLOSE * 1.5 * Math.random() - TILE_CLOSE * 0.75
        const z = Math.random() * 1
        const vx = 1 + Math.random() * 200
        const vy = 1 + Math.random() * 200
        const distance = 3000 + Math.random() * 2000
        const size = 100 + Math.random() * 100

        vertexMap[id] = {
          pos: [x, y, z],
          velocity: [vx, vy],
          size,
          distance,
        }
      }
      return vertexMap[id]
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0
      const height = canvas?.height ?? 0
      const distTime = Date.now() - startTime

      ctx?.clearRect(0, 0, width, height)

      const maxSX = Math.ceil(width / TILE_CLOSE)
      const maxSY = Math.ceil(height / TILE_CLOSE)

      for (let sx = 0; sx <= maxSX; ++sx) {
        for (let sy = 0; sy <= maxSY; ++sy) {
          const { velocity, distance, pos, size } = getVertex(sx, sy)
          const scalar = Math.sqrt(
            velocity[0] * velocity[0] + velocity[1] * velocity[1]
          )
          const totalDistance = (distTime * scalar) / 1000
          const isReverse = Math.floor(totalDistance / distance) % 2 !== 0
          let nextDistance = totalDistance % distance

          if (isReverse) {
            nextDistance = distance - nextDistance
          }
          const x = pos[0] + (nextDistance / scalar) * velocity[0]
          const y = pos[1] + (nextDistance / scalar) * velocity[1]
          const a = 1 - pos[2]

          ctx?.beginPath()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx!.fillStyle = `rgba(255, 255, 255, ${a})`
          ctx?.arc(x, y, size, 0, 2 * Math.PI)
          ctx?.fill()
        }
      }
    }
    const observer = new ResizeObserver(() => {
      const inlineSize = parentElement?.offsetWidth ?? 0
      const blockSize = parentElement?.offsetHeight ?? 0

      cancelAnimationFrame(resizeAnimationFrameIdRef.current)
      resizeAnimationFrameIdRef.current = requestAnimationFrame(() => {
        if (canvas) {
          canvas.width = inlineSize
          canvas.height = blockSize
          canvas.style.cssText += `width: ${inlineSize}px; height: ${blockSize}px; filter: blur(100px); opacity: 0.15;`
          onRenderRef.current?.()
        }
      })
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    parentElement && observer.observe(parentElement)

    return () => {
      cancelAnimationFrame(resizeAnimationFrameIdRef.current)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const requestAnimation = () => {
      onRenderRef.current?.()
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation)
    }

    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation)
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={
        'pointer-events-none fixed top-0 right-0 bottom-0 left-0 opacity-0 transition-opacity duration-100'
      }
    />
  )
}

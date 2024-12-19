import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'nextra/hooks'
import { useEffect, useRef } from 'react'

const CodeBlockClassName = 'nextra-code'

const escapeHtml = (text: string) =>
  text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`)

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc))

export const HomePage = ({
  description,
  buttonText,
  items,
  children,
}: {
  title: string
  description: string
  buttonText: string
  items: { title: string; desc: string }[]
  version: number
  children?: React.ReactNode
}) => {
  const router = useRouter()

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-[url('/img/homepage_background.svg')] bg-cover bg-center bg-no-repeat pb-20"
      >
        <StarCanvasClose />
        <StarCanvasFar />
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/img/homepage_logo.png"
              alt="Suspensive with star"
              width={360}
              height={360}
              className="-mb-4 hidden md:block md:h-auto md:w-auto"
            />
            <Image
              src="/img/homepage_logo.png"
              alt="Suspensive with star"
              width={210}
              height={210}
              className="-mb-4 md:hidden md:h-auto md:w-auto"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="break-keep px-4 text-4xl font-bold leading-tight md:text-6xl">
                <span>{description}</span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.6,
                  transition: { delay: 0.1, duration: 1 },
                }}
                className="rounded-full text-lg text-white md:text-xl"
              >
                npm i @suspensive/react
              </motion.p>
            </div>
          </div>
          <Link href={`/${router.locale}/docs/react/motivation`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [1, 0.7, 1],
                transition: {
                  delay: 1,
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              type="button"
              className="rounded-xl bg-white px-10 py-3 text-lg font-bold text-[#111111] md:text-xl"
            >
              {buttonText}
            </motion.button>
          </Link>
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
        className="container mx-auto px-4"
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
      className="absolute bottom-0 left-0 right-0 top-0 -z-10 opacity-70"
    />
  )
}

const TILE_CLOSE = 500

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
        const distance = 5000 + Math.random() * 9000
        const size = 30 + Math.random() * 80

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
          canvas.style.cssText += `width: ${inlineSize}px; height: ${blockSize}px; filter: blur(70px);`
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
      className="absolute bottom-0 left-0 right-0 top-0 -z-10 opacity-40"
    />
  )
}

'use client'

import { ClientOnly, Delay } from '@suspensive/react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useTheme } from 'nextra-theme-docs'
import { type ReactNode, useEffect, useRef } from 'react'
import { BorderTrail } from './BorderTrail'
import { GlowEffect } from './GlowEffect'
import { LogoImage } from './Logo'
import { Magnetic } from './Magnetic'
import { NpmInstallCopyButton } from './NpmInstallCopyButton'
import { Spotlight } from './Spotlight'
import { Tilt } from './Tilt'

const CodeBlockClassName = 'nextra-code'

const escapeHtml = (text: string) =>
  text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`)

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc))

export const HomePage = ({
  buttonText,
  tagline,
  subtitle,
  items,
  children,
}: {
  buttonText: string
  tagline?: string
  subtitle?: string
  items?: { title: string; desc: string }[]
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
        className="-mx-4 -mt-4 bg-[url('/img/homepage_background.svg')] bg-cover bg-center bg-no-repeat pb-8 transition-colors duration-300 md:-mx-12 md:pb-12"
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="align-center mx-6 mt-10 -mb-6 flex justify-center pt-6 pb-6 md:mt-16 md:pt-12 md:pb-8">
              <LogoImage size={2.4} />
            </div>
            {tagline && (
              <h1 className="mx-4 text-2xl font-bold tracking-tight md:text-4xl">
                {tagline}
              </h1>
            )}
            {subtitle && (
              <p className="mx-4 mt-3 max-w-xl text-sm opacity-60 md:text-lg">
                {subtitle}
              </p>
            )}
            <NpmInstallCopyButton />
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
                    <Link href={`/docs/react/getting-started`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: 1.01 }}
                        type="button"
                        className="cursor-pointer rounded-xl bg-black px-7 py-2 text-lg font-semibold text-white/80 transition-colors duration-300 md:px-7 md:py-3 md:text-xl"
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

        {items && items.length > 0 && <div className="h-24 md:h-40" />}
        <div className="container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row">
          {items?.map(({ title, desc }, index) => (
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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.2 }}
        className="homepage-content container"
      >
        {children}
      </motion.section>
    </>
  )
}

interface Star {
  x: number
  y: number
  size: number
  baseAlpha: number
  twinkleSpeed: number
  twinkleOffset: number
  driftX: number
  driftY: number
  driftRadius: number
}

const STAR_DENSITY = 0.00015 // stars per pixel²

const StarCanvasFar = () => {
  const animationFrameIdRef = useRef<number | null>(null)
  const resizeAnimationFrameIdRef = useRef(0)
  const onRenderRef = useRef<VoidFunction | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const prevSizeRef = useRef({ w: 0, h: 0 })
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const parentElement = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const startTime = Date.now()

    function generateStars(width: number, height: number) {
      const count = Math.floor(width * height * STAR_DENSITY)
      const stars: Star[] = []
      for (let i = 0; i < count; i++) {
        // Power distribution: many tiny stars, few bright ones
        const sizePow = Math.pow(Math.random(), 3)
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.3 + sizePow * 2.2,
          baseAlpha: 0.15 + Math.random() * 0.65,
          twinkleSpeed: 0.5 + Math.random() * 2.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: Math.random() * Math.PI * 2,
          driftY: Math.random() * Math.PI * 2,
          driftRadius: 2 + Math.random() * 8,
        })
      }
      return stars
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0
      const height = canvas?.height ?? 0
      if (!ctx || width === 0) return

      const elapsed = (Date.now() - startTime) / 1000
      ctx.clearRect(0, 0, width, height)

      const rgb = resolvedTheme === 'dark' ? '255,255,255' : '0,0,0'

      for (const star of starsRef.current) {
        // Gentle sine drift instead of linear bounce
        const x =
          star.x + Math.sin(elapsed * 0.15 + star.driftX) * star.driftRadius
        const y =
          star.y + Math.cos(elapsed * 0.12 + star.driftY) * star.driftRadius

        // Twinkle: smooth alpha oscillation
        const twinkle =
          0.5 + 0.5 * Math.sin(elapsed * star.twinkleSpeed + star.twinkleOffset)
        const alpha = star.baseAlpha * (0.4 + 0.6 * twinkle)

        if (star.size > 1.2) {
          // Larger stars get a soft glow
          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            star.size * 2.5
          )
          gradient.addColorStop(0, `rgba(${rgb},${alpha})`)
          gradient.addColorStop(0.4, `rgba(${rgb},${alpha * 0.3})`)
          gradient.addColorStop(1, `rgba(${rgb},0)`)
          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(x, y, star.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Small stars: simple dot
          ctx.beginPath()
          ctx.fillStyle = `rgba(${rgb},${alpha})`
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
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
          // Regenerate stars only when size changes significantly
          if (
            Math.abs(inlineSize - prevSizeRef.current.w) > 50 ||
            Math.abs(blockSize - prevSizeRef.current.h) > 50
          ) {
            starsRef.current = generateStars(inlineSize, blockSize)
            prevSizeRef.current = { w: inlineSize, h: blockSize }
          }
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
  }, [resolvedTheme])

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

interface GlowOrb {
  x: number
  y: number
  size: number
  alpha: number
  driftX: number
  driftY: number
  driftRadius: number
}

const GLOW_COUNT = 5

const StarCanvasClose = () => {
  const animationFrameIdRef = useRef<number | null>(null)
  const resizeAnimationFrameIdRef = useRef(0)
  const onRenderRef = useRef<VoidFunction | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<GlowOrb[]>([])
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const parentElement = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const startTime = Date.now()

    function generateOrbs(width: number, height: number) {
      const orbs: GlowOrb[] = []
      for (let i = 0; i < GLOW_COUNT; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 100 + Math.random() * 150,
          alpha: 0.3 + Math.random() * 0.7,
          driftX: Math.random() * Math.PI * 2,
          driftY: Math.random() * Math.PI * 2,
          driftRadius: 50 + Math.random() * 150,
        })
      }
      return orbs
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0
      const height = canvas?.height ?? 0
      if (!ctx || width === 0) return

      const elapsed = (Date.now() - startTime) / 1000
      ctx.clearRect(0, 0, width, height)

      const rgb = resolvedTheme === 'dark' ? '255,255,255' : '0,0,0'

      for (const orb of orbsRef.current) {
        const x =
          orb.x + Math.sin(elapsed * 0.08 + orb.driftX) * orb.driftRadius
        const y =
          orb.y + Math.cos(elapsed * 0.06 + orb.driftY) * orb.driftRadius

        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb},${orb.alpha})`
        ctx.arc(x, y, orb.size, 0, Math.PI * 2)
        ctx.fill()
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
          orbsRef.current = generateOrbs(inlineSize, blockSize)
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
  }, [resolvedTheme])

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

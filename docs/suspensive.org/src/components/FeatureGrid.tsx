'use client'

import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { BorderTrail } from './BorderTrail'

interface Feature {
  title: string
  description: string
  href: string
  code?: string
  span?: 2
}

// github-dark theme colors (matching CodeHike/Scrollycoding)
const C = {
  keyword: '#FF7B72', // import, const, return
  string: '#A5D6FF', // "string"
  tag: '#7EE787', // JSX tag names
  prop: '#79C0FF', // JSX props
  func: '#D2A8FF', // function names, variables
  spread: '#FFA657', // component names, spread targets
  punct: '#C9D1D9', // < > { } = /
  comment: '#6e7681', // comments
  text: '#C9D1D9', // default
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'const',
  'let',
  'var',
  'return',
  'function',
  'if',
  'else',
  'new',
])

type Token = { text: string; color?: string }

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    // Comments
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i)
      const slice = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ text: slice, color: C.comment })
      i += slice.length
      continue
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]
      let j = i + 1
      while (j < code.length && code[j] !== quote) j++
      tokens.push({ text: code.slice(i, j + 1), color: C.string })
      i = j + 1
      continue
    }

    // JSX tags: < or </
    if (code[i] === '<') {
      let tag = '<'
      let j = i + 1
      if (code[j] === '/') {
        tag += '/'
        j++
      }
      let name = ''
      while (j < code.length && /[\w.]/.test(code[j])) {
        name += code[j]
        j++
      }
      if (name) {
        tokens.push({ text: tag, color: C.punct })
        tokens.push({ text: name, color: C.tag })
        i = j
        continue
      }
      tokens.push({ text: '<', color: C.punct })
      i++
      continue
    }

    if (code[i] === '>' || (code[i] === '/' && code[i + 1] === '>')) {
      const closing = code[i] === '/' ? '/>' : '>'
      tokens.push({ text: closing, color: C.punct })
      i += closing.length
      continue
    }

    // Spread: ...name
    if (code[i] === '.' && code[i + 1] === '.' && code[i + 2] === '.') {
      tokens.push({ text: '...', color: C.keyword })
      i += 3
      let name = ''
      while (i < code.length && /[\w]/.test(code[i])) {
        name += code[i]
        i++
      }
      if (name) tokens.push({ text: name, color: C.spread })
      continue
    }

    // Arrow =>
    if (code[i] === '=' && code[i + 1] === '>') {
      tokens.push({ text: '=>', color: C.keyword })
      i += 2
      continue
    }

    // Braces / parens
    if ('{}()'.includes(code[i])) {
      tokens.push({ text: code[i], color: C.punct })
      i++
      continue
    }

    // Words
    if (/[a-zA-Z_$]/.test(code[i])) {
      let word = ''
      while (i < code.length && /[\w$]/.test(code[i])) {
        word += code[i]
        i++
      }
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, color: C.keyword })
      } else if (i < code.length && code[i] === '=') {
        tokens.push({ text: word, color: C.prop })
      } else if (i < code.length && code[i] === '(') {
        tokens.push({ text: word, color: C.func })
      } else {
        tokens.push({ text: word, color: C.text })
      }
      continue
    }

    tokens.push({ text: code[i], color: C.text })
    i++
  }

  return tokens
}

function highlightJSX(code: string): string {
  return tokenize(code)
    .map(({ text, color }) => {
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return color ? `<span style="color:${color}">${escaped}</span>` : escaped
    })
    .join('')
}

function FeatureCard({
  item,
  index,
  linkText,
}: {
  item: Feature
  index: number
  linkText: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })
  const wasInViewOnMount = useRef(false)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      wasInViewOnMount.current = rect.top < window.innerHeight
    }
  }, [])

  // First screen: longer stagger for sequential reveal
  // Scrolled into view: minimal delay for snappy feel
  const delay = wasInViewOnMount.current ? 0.5 + index * 0.1 : index * 0.04

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        delay,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden rounded-[inherit] bg-[#0a0a0a] p-8 ${
        item.span === 2 ? 'md:col-span-2' : ''
      }`}
    >
      <BorderTrail
        size={120}
        className="opacity-15 group-hover:opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--glow-rgb),0.8) 0%, rgba(var(--glow-rgb),0.3) 30%, rgba(var(--glow-rgb),0) 70%)',
          filter: 'blur(4px)',
        }}
        transition={{
          repeat: Infinity,
          duration: 6 + index * 0.5,
          ease: 'linear',
        }}
      />
      <Link href={item.href} className="absolute inset-0 z-10" />
      <h3 className="mb-2 font-mono text-sm font-semibold tracking-tight">
        {item.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {item.description}
      </p>
      {item.code && (
        <pre
          className="mb-4 rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <code
            dangerouslySetInnerHTML={{
              __html: highlightJSX(item.code),
            }}
          />
        </pre>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-100">
        {linkText}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </motion.div>
  )
}

export const FeatureGrid = ({
  items,
  linkText = 'Learn more',
}: {
  items: Feature[]
  linkText?: string
}) => {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 rounded-2xl md:grid-cols-2 md:gap-px md:border md:border-white/5 md:bg-white/[0.06] lg:grid-cols-3">
      {items.map((item, index) => (
        <FeatureCard
          key={item.title}
          item={item}
          index={index}
          linkText={linkText}
        />
      ))}
    </div>
  )
}

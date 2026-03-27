'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

interface Row {
  feature: string
  values: boolean[]
}

interface Group {
  label: string
  rows: Row[]
}

export const ComparisonTable = ({
  groups,
  headers,
}: {
  groups: Group[]
  headers: string[]
}) => {
  const ref = useRef<HTMLTableElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  let globalRowIdx = 0

  return (
    <div className="overflow-x-auto">
      <table ref={ref} className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="pr-4 pb-3" />
            <th className="pr-8 pb-3 pl-4 font-medium opacity-40" />
            {headers.map((h, i) => (
              <th
                key={h}
                className={`pr-6 pb-3 font-medium ${i === 0 ? '' : 'opacity-40'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-400">
          {groups.map((group) => {
            const groupRows = group.rows.map((row, rowIdx) => {
              const currentGlobalIdx = globalRowIdx++
              const isLastInGroup = rowIdx === group.rows.length - 1

              return (
                <tr
                  key={row.feature}
                  className={
                    isLastInGroup
                      ? 'border-b-2 border-gray-200 dark:border-gray-800'
                      : 'border-b border-gray-100 dark:border-gray-900'
                  }
                >
                  {rowIdx === 0 && (
                    <td
                      rowSpan={group.rows.length}
                      className="border-r border-gray-100 pr-4 align-middle text-xs font-medium tracking-widest uppercase opacity-30 dark:border-gray-900"
                    >
                      <span
                        style={{
                          writingMode: 'vertical-lr',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {group.label}
                      </span>
                    </td>
                  )}
                  <td className="py-2.5 pr-8 pl-4">{row.feature}</td>
                  {row.values.map((val, colIdx) => (
                    <td key={colIdx} className="py-2.5 pr-6">
                      {val ? (
                        <Check
                          isInView={isInView}
                          delay={currentGlobalIdx * 0.08 + colIdx * 0.03}
                        />
                      ) : (
                        <span className="opacity-20">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })

            return groupRows
          })}
        </tbody>
      </table>
    </div>
  )
}

function Check({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, y: -8 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0, y: -8 }
      }
      transition={{
        delay,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="inline-block text-emerald-500"
    >
      ✓
    </motion.span>
  )
}

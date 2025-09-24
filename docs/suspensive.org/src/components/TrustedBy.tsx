'use client'

import { motion } from 'motion/react'

interface TrustedByProps {
  title?: string
  description?: string
}

export const TrustedBy = ({
  title = 'Trusted by',
  description = 'Used by teams at these companies',
}: TrustedByProps) => {
  // Initial set of companies - this can be expanded as companies add themselves
  const companies = [
    {
      name: 'Toss',
      logo: 'https://static.toss.im/logos/png/4x/logo-toss-blue.png',
      website: 'https://toss.im',
    },
  ]

  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="container mx-auto px-4 py-16"
    >
      <div className="mb-12 text-center">
        <h3 className="mb-3 text-2xl font-bold md:text-3xl">{title}</h3>
        <p className="text-sm opacity-75 md:text-lg">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {companies.map((company, index) => (
          <motion.a
            key={company.name}
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.8 + index * 0.1, duration: 0.3 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center rounded-lg p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-8 w-auto opacity-60 transition-opacity duration-200 hover:opacity-100 md:h-10"
              style={{ maxWidth: '120px' }}
            />
          </motion.a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-sm opacity-60">
          Using Suspensive at your company?
        </p>
        <a
          href="https://github.com/toss/suspensive/edit/main/docs/suspensive.org/src/components/TrustedBy.tsx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10"
        >
          Add your company
        </a>
      </div>
    </motion.section>
  )
}

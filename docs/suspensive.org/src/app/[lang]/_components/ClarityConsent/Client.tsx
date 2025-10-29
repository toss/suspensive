'use client'
import { ClientOnly } from '@suspensive/react'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { useTheme } from 'nextra-theme-docs'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { STORAGE_KEYS } from '@/constants'

export const CookieConsentClient = ClientOnly.with({}, () => {
  const { resolvedTheme } = useTheme()
  const [consent, setConsent] = useLocalStorage<'granted' | 'denied' | null>(
    STORAGE_KEYS.COOKIE_CONSENT,
    null
  )

  useEffect(() => {
    if (consent === 'granted') window.clarity?.('consent', true)
  }, [consent])

  if (consent === 'granted' || consent === 'denied') {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'fixed right-0 bottom-0 left-0 z-[9999] border-t p-[1rem]',
        'transition-all duration-300',
        resolvedTheme === 'light'
          ? 'border-gray-200 bg-white text-black'
          : 'border-gray-800 bg-black text-white'
      )}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[1rem]">
        <div>
          <p className="m-0 text-[0.875rem] leading-[1.5]">
            We use cookies and similar technologies to provide, protect, and
            improve our services. This includes using Microsoft Clarity for
            analytics and user experience improvements. By clicking
            &quot;Accept&quot;, you consent to the use of these technologies for
            analytics purposes.
          </p>
        </div>
        <div className="flex flex-wrap gap-[0.75rem]">
          <button
            className="cursor-pointer rounded-[0.375rem] px-[1.5rem] py-[0.5rem] text-[0.875rem] font-medium transition-opacity duration-200 hover:opacity-80"
            type="button"
            onClick={() => {
              setConsent('granted')
              window.clarity?.('consent', true)
            }}
          >
            Accept
          </button>
          <button
            className="cursor-pointer rounded-[0.375rem] px-[1.5rem] py-[0.5rem] text-[0.875rem] font-medium transition-opacity duration-200 hover:opacity-80"
            type="button"
            onClick={() => {
              setConsent('denied')
              window.clarity?.('consent', false)
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  )
})

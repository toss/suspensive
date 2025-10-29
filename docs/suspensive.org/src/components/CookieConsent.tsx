'use client'

import { ClientOnly } from '@suspensive/react'
import { motion } from 'motion/react'
import { useTheme } from 'nextra-theme-docs'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { STORAGE_KEYS } from '@/constants'
import { isUserInEEA } from '@/utils/geolocation'

export const CookieConsent = ClientOnly.with({}, () => {
  const { resolvedTheme } = useTheme()
  const [consent, setConsent] = useLocalStorage<'granted' | 'denied' | null>(
    STORAGE_KEYS.COOKIE_CONSENT,
    null
  )
  const [isEEAUser, setIsEEAUser] = useState<boolean | null>(null)

  useEffect(() => {
    // Detect if user is in EEA
    const inEEA = isUserInEEA()
    setIsEEAUser(inEEA)

    // If user is not in EEA and consent hasn't been set, automatically grant consent
    if (!inEEA) {
      if (consent === null) {
        setConsent('granted')
      }
      if (consent === 'granted') {
        window.clarity?.('consent', true)
      }
    }
  }, [consent, setConsent])

  useEffect(() => {
    if (consent === 'granted') window.clarity?.('consent', true)
  }, [consent])

  // Don't show banner if:
  // 1. Consent has already been granted or denied
  // 2. User is confirmed to be outside EEA (consent is auto-granted)
  // 3. Still detecting user location (isEEAUser is null)
  if (
    consent === 'granted' ||
    consent === 'denied' ||
    isEEAUser === false ||
    isEEAUser === null
  ) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor:
          resolvedTheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(17, 17, 17)',
        borderTop:
          resolvedTheme === 'light'
            ? '1px solid rgba(0, 0, 0, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.3)',
        color:
          resolvedTheme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
        padding: '1rem',
        zIndex: 9999,
        boxShadow:
          resolvedTheme === 'light'
            ? '0 -4px 12px rgba(0, 0, 0, 0.1)'
            : '0 -4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
            We use cookies and similar technologies to provide, protect, and
            improve our services. This includes using Microsoft Clarity for
            analytics and user experience improvements. By clicking
            &quot;Accept&quot;, you consent to the use of these technologies for
            analytics purposes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setConsent('granted')
              window.clarity?.('consent', true)
            }}
            style={{
              padding: '0.5rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent('denied')
              window.clarity?.('consent', false)
            }}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'transparent',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  )
})

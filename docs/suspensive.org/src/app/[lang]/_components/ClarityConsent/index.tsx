import { headers } from 'next/headers'
import { CookieConsentClient } from './Client'

export const CookieConsent = () =>
  headers().then((headers) => {
    const xVercelIpCountry = headers.get('x-vercel-ip-country')
    return xVercelIpCountry && GDPR_COUNTRIES.includes(xVercelIpCountry) ? (
      <CookieConsentClient />
    ) : null
  })

const GDPR_COUNTRIES = [
  // EEA: European Economic Area
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czechia Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'IS', // Iceland
  'LI', // Liechtenstein
  'NO', // Norway
  // Non-EEA: Countries outside the EEA
  'GB', // United Kingdom
  'CH', // Switzerland
]

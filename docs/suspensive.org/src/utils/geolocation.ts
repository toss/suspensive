/**
 * List of European Economic Area (EEA) country codes and timezones
 * EEA includes EU countries plus Iceland, Liechtenstein, and Norway
 */
const EEA_TIMEZONES = [
  // Western Europe
  'Europe/London',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Atlantic/Madeira',
  'Atlantic/Canary',
  'Atlantic/Azores',
  // Central Europe
  'Europe/Paris',
  'Europe/Brussels',
  'Europe/Amsterdam',
  'Europe/Luxembourg',
  'Europe/Berlin',
  'Europe/Zurich',
  'Europe/Vienna',
  'Europe/Prague',
  'Europe/Budapest',
  'Europe/Warsaw',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Copenhagen',
  'Europe/Stockholm',
  'Europe/Oslo',
  'Europe/Helsinki',
  // Eastern Europe
  'Europe/Athens',
  'Europe/Bucharest',
  'Europe/Sofia',
  'Europe/Tallinn',
  'Europe/Riga',
  'Europe/Vilnius',
  'Europe/Zagreb',
  'Europe/Ljubljana',
  'Europe/Bratislava',
  // Other EEA territories
  'Europe/Reykjavik',
  'Europe/Vaduz',
  'Europe/Andorra',
  'Europe/Monaco',
  'Europe/San_Marino',
  'Europe/Vatican',
]

/**
 * Detects if the user is likely in the European Economic Area (EEA)
 * based on their browser timezone.
 *
 * Note: This is a privacy-friendly approach that doesn't require external API calls
 * or tracking. It may have false positives/negatives but is sufficient for GDPR
 * compliance purposes (showing consent when in doubt is better than not showing it).
 *
 * @returns true if the user appears to be in the EEA, false otherwise
 */
export function isUserInEEA(): boolean {
  try {
    // Get the user's timezone using the Intl API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Check if the timezone is in the EEA list
    return EEA_TIMEZONES.includes(timezone)
  } catch (error) {
    // If timezone detection fails, assume user is in EEA to be safe (show consent)
    console.warn('Failed to detect timezone for EEA check:', error)
    return true
  }
}

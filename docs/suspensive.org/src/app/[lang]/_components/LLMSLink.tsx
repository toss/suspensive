import Link from 'next/link'

export function LLMSLink() {
  return (
    <Link
      href="/llms.txt"
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      title="LLMs documentation for AI tools"
    >
      llms.txt
    </Link>
  )
}

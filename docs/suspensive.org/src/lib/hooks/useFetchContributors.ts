import { useEffect, useState } from 'react'
import type { GithubRepoContributor } from '../../types'

const useFetchContributors = (): GithubRepoContributor[] => {
  const [contributors, setContributors] = useState<GithubRepoContributor[]>([])

  useEffect(() => {
    async function fetchContributors(): Promise<void> {
      try {
        const response = await fetch('https://api.github.com/repos/toss/suspensive/stats/contributors')
        if (!response.ok) {
          throw new Error('Failed to fetch contributors')
        }
        const data: GithubRepoContributor[] = (await response.json()) as GithubRepoContributor[]
        const filteredContributors = data.filter((contributor) => {
          const login = contributor.author.login
          return !['github-actions[bot]', 'dependabot[bot]', 'renovate[bot]'].includes(login)
        })
        setContributors(filteredContributors)
      } catch (error) {
        console.error('Error fetching contributors:', error)
      }
    }

    void fetchContributors()
  }, [])

  return contributors
}

export default useFetchContributors

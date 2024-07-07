interface Week {
  w: number // Week timestamp in epoch seconds
  a: number // Number of additions
  d: number // Number of deletions
  c: number // Number of commits
}

interface Author {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface GithubRepoContributor {
  author: Author
  total: number
  weeks: Week[]
}

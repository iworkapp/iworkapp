import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} on iwork` : 'iwork: Tweet to get paid'
  }, [title])
}

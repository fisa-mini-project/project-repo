import { useEffect, useState } from 'react'

export const useCurrentTabUrl = (maxPathLength = 3000) => {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    const fetchUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          try {
            const fullUrl = tabs[0].url
            const { origin, pathname } = new URL(fullUrl)
            const trimmedPath =
              pathname.length > maxPathLength ? pathname.slice(0, maxPathLength) + '…' : pathname
            setCurrentUrl(`${origin}${trimmedPath}`)
          } catch (err) {
            setCurrentUrl(tabs[0].url) // fallback
          }
        }
      })
    }

    fetchUrl()

    chrome.tabs.onActivated.addListener(fetchUrl)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.active && changeInfo.url) {
        fetchUrl()
      }
    })

    return () => {
      chrome.tabs.onActivated.removeListener(fetchUrl)
      chrome.tabs.onUpdated.removeListener(() => {})
    }
  }, [maxPathLength])

  return currentUrl
}

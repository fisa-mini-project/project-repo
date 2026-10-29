import { useEffect, useState } from 'react'

export const useCurrentTabUrl = () => {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    const fetchUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          setCurrentUrl(tabs[0].url || '')
        }
      })
    }

    fetchUrl()

    chrome.tabs.onActivated.addListener(fetchUrl)
    const handleUpdated = (tabId, changeInfo, tab) => {
      if (tab.active && changeInfo.url) {
        fetchUrl()
      }
    }
    chrome.tabs.onUpdated.addListener(handleUpdated)

    return () => {
      chrome.tabs.onActivated.removeListener(fetchUrl)
      chrome.tabs.onUpdated.removeListener(handleUpdated)
    }
  }, [])

  return currentUrl
}

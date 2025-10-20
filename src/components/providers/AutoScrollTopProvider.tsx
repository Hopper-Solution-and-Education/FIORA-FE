'use client'

import { useIsomorphicEffect } from '@/shared/hooks'
import { ScrollType, useAppScroll } from '@/shared/hooks/useAppScroll'
import { useNavigationState } from '@/shared/hooks/useNavigationState'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

export const AutoScrollTopProvider = () => {
  const pathname = usePathname()
  const { scroll } = useAppScroll()
  const { isNavigating, navigationStartTime } = useNavigationState()
  const prevPathnameRef = useRef<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useIsomorphicEffect(() => {
    const prevPathname = prevPathnameRef.current

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only scroll if the base route changed (not just parameters) and navigation is complete
    if (prevPathname && pathname && prevPathname !== pathname && !isNavigating) {
      const prevBaseRoute = prevPathname.split('?')[0].split('#')[0]
      const currentBaseRoute = pathname.split('?')[0].split('#')[0]

      if (prevBaseRoute !== currentBaseRoute) {
        // Calculate adaptive delay based on navigation time
        const navigationTime = navigationStartTime ? Date.now() - navigationStartTime : 0
        const baseDelay = 200
        const adaptiveDelay = Math.max(baseDelay, 400 - navigationTime) // Longer delay for faster navigation

        // Use requestAnimationFrame for better timing
        const frameId = requestAnimationFrame(() => {
          timeoutRef.current = setTimeout(() => {
            // Final check to ensure we're still on the same path and navigation is complete
            if (prevPathnameRef.current === pathname && !isNavigating) {
              scroll({
                type: ScrollType.ToTop,
              })
            }
          }, adaptiveDelay)
        })

        return () => {
          cancelAnimationFrame(frameId)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        }
      }
    }

    prevPathnameRef.current = pathname

    // Cleanup timeout on unmount or pathname change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname, scroll, isNavigating, navigationStartTime])

  return null
}

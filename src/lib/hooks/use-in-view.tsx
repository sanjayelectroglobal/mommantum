/**
 * @file use-in-view.tsx
 * @description IntersectionObserver hook for detecting when an element enters the viewport.
 * 
 * WHAT: Observes an HTML element and updates state when it scrolls into view.
 * WHY: Used for lazy-loading content, scroll-triggered animations, and deferring non-critical assets.
 */

"use client"
import { RefObject, useEffect, useState } from "react"

/**
 * useIntersection
 * 
 * @param element - RefObject pointing to the target HTML element to observe
 * @param rootMargin - Margin around the root viewport (e.g., '0px', '200px')
 * @returns boolean - True if the element intersects with the viewport
 */
export const useIntersection = (
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string
) => {
  // Track whether the element is currently visible within the viewport margin
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    // If the ref has not yet attached to a DOM node, exit early
    if (!element.current) {
      return
    }

    const el = element.current

    // Initialize IntersectionObserver with the configured margin
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    // Start observing the target element
    observer.observe(el)

    // Cleanup observer on unmount or when dependencies change
    return () => observer.unobserve(el)
  }, [element, rootMargin])

  return isVisible
}

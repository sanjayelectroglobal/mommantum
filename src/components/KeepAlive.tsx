"use client"

import { useEffect } from "react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// Extract the first URL if there are multiple comma-separated URLs
const getBackendUrl = () => {
  if (BACKEND_URL.includes(",")) {
    return BACKEND_URL.split(",")[0].trim()
  }
  return BACKEND_URL
}

export default function KeepAlive() {
  useEffect(() => {
    let isComponentMounted = true

    // Function to ping the backend
    const pingBackend = async () => {
      if (!isComponentMounted) return

      const startTime = Date.now()

      try {
        // Use a timeout for the fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const response = await fetch("/api/keep-alive", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const duration = Date.now() - startTime

        if (response.ok) {
          console.log(
            `✅ Backend keep-alive ping successful at ${new Date().toLocaleTimeString()} (${duration}ms)`
          )
          
          if (duration > 5000) {
            console.log(`   ⚠️  Slow response - backend may have been sleeping`)
          }
        } else {
          console.warn(
            `⚠️  Backend returned status ${response.status} at ${new Date().toLocaleTimeString()}`
          )
        }
      } catch (error: any) {
        const duration = Date.now() - startTime

        if (error.name === "AbortError") {
          console.warn(
            `⏱️  Backend keep-alive timed out at ${new Date().toLocaleTimeString()} (>${duration}ms)`
          )
        } else {
          console.warn(
            `❌ Backend keep-alive ping failed at ${new Date().toLocaleTimeString()}:`,
            error.message
          )
        }
      }
    }

    // Ping immediately on mount
    pingBackend()

    // Set up interval to ping every 2 minutes (120000 ms)
    const intervalId = setInterval(pingBackend, 120000)

    console.log("🔄 Backend keep-alive service started (pings every 2 minutes)")

    // Cleanup interval on unmount
    return () => {
      isComponentMounted = false
      clearInterval(intervalId)
      console.log("⏹️ Backend keep-alive service stopped")
    }
  }, [])

  // This component renders nothing
  return null
}

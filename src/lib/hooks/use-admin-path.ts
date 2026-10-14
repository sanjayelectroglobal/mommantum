import { useState, useEffect } from "react"

export function useAdminPath() {
  const [adminPath, setAdminPath] = useState("admin")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/").filter(Boolean)
      const currentRoot = pathSegments[0] || "admin"
      setAdminPath(currentRoot)
    }
  }, [])

  const prefixPath = (href: string) => {
    if (adminPath === "admin") return href
    return href.replace(/^\/admin/, `/${adminPath}`)
  }

  return { adminPath, prefixPath }
}

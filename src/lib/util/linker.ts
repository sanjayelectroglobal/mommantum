export function injectInternalLinks(
  htmlContent: string,
  keywords: { keyword: string; target_url: string; max_matches_per_page?: number }[]
): string {
  if (!htmlContent || !keywords || keywords.length === 0) return htmlContent

  let hydratedContent = htmlContent

  // Sort keywords by length descending to prevent shorter sub-words from replacing inside longer keywords first
  const sortedKeywords = [...keywords].sort(
    (a, b) => (b.keyword?.length || 0) - (a.keyword?.length || 0)
  )

  for (const item of sortedKeywords) {
    if (!item.keyword) continue

    // Normalize URL: Ensure leading slash for relative internal paths so links open properly
    let targetUrl = item.target_url ? item.target_url.trim() : ""
    if (!targetUrl) continue

    const isExternal = /^https?:\/\//i.test(targetUrl) && !targetUrl.includes("mommantum.com")
    if (!isExternal && !targetUrl.startsWith("/") && !targetUrl.startsWith("#") && !targetUrl.startsWith("http")) {
      targetUrl = "/" + targetUrl
    }

    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ""
    const escapedKeyword = item.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    // Match HTML tags OR word boundary keyword
    const regex = new RegExp(`(<[^>]+>)|(\\b${escapedKeyword}\\b)`, "gi")

    let matchCount = 0
    const maxMatches = item.max_matches_per_page || 1
    let insideAnchor = 0

    hydratedContent = hydratedContent.replace(regex, (fullMatch, tag, kwMatch) => {
      if (tag) {
        // Track whether we are inside an <a> tag to avoid nesting links inside existing anchors
        const lowerTag = tag.toLowerCase()
        if (lowerTag.startsWith("<a ") || lowerTag === "<a>") {
          insideAnchor++
        } else if (lowerTag.startsWith("</a")) {
          insideAnchor = Math.max(0, insideAnchor - 1)
        }
        return tag
      }

      if (kwMatch && insideAnchor === 0 && matchCount < maxMatches) {
        matchCount++
        return `<a href="${targetUrl}"${targetAttr} class="internal-link text-[#e61e73] font-semibold hover:underline">${kwMatch}</a>`
      }

      return fullMatch
    })
  }

  return hydratedContent
}


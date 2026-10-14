/**
 * Safe JSON-LD serializer.
 * Replaces characters that could cause script breakout or HTML parser issues:
 * - '<' -> '\u003c' (prevents </script> breakout)
 * - '>' -> '\u003e'
 * - '&' -> '\u0026'
 * - U+2028 (Line separator) -> '\u2028'
 * - U+2029 (Paragraph separator) -> '\u2029'
 */
export function serializeJsonLd(data: unknown): string {
  if (data === null || data === undefined) {
    return ""
  }

  const rawJson = typeof data === "string" ? data : JSON.stringify(data)

  return rawJson
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

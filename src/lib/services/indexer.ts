import { google } from "googleapis"

export async function notifyGoogleOfUpdate(url: string, type: "URL_UPDATED" | "URL_DELETED") {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    console.warn("Google Indexing API credentials missing. Skipping real-time index submission.")
    return null
  }

  try {
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/indexing"]
    })

    await jwtClient.authorize()

    const response = await google.indexing("v3").urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url,
        type,
      },
    })

    console.log(`Successfully notified Google of ${type} for URL: ${url}`, response.data)
    return response.data
  } catch (err: any) {
    console.error("Failed to notify Google Indexing API:", err.message)
    return null
  }
}

// Phase 2: Removed all store/cart/customer/shipping imports and logic.
// This layout now only sets metadataBase and renders children — no Medusa SDK calls.
import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return <>{props.children}</>
}

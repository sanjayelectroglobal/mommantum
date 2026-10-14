"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ServiceEditor from "../_components/ServiceEditor"

export default function EditService() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/services/${slug}`)
      .then((r) => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then((d) => { if (d) setService(d) })
  }, [slug])

  if (notFound) return <div className="flex h-64 items-center justify-center text-slate-400">Service not found</div>
  if (!service) return <div className="flex h-64 items-center justify-center text-slate-400">Loading...</div>

  return <ServiceEditor initialData={service} isEdit />
}
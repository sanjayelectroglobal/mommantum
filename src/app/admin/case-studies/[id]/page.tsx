"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import CaseStudyEditor from "../_components/CaseStudyEditor"

export default function EditCaseStudyPage() {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const { id } = useParams<{ id: string }>()
  const [study, setStudy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/case-studies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        setStudy(data)
        setLoading(false)
      })
      .catch(() => {
        alert("Failed to load case study details")
        router.push(prefixPath("/admin/case-studies"))
      })
  }, [id, router])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading case study details...
      </div>
    )
  }

  return <CaseStudyEditor initialData={study} isEdit />
}

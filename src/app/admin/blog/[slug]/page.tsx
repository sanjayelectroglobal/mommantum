"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BlogEditor from "../_components/BlogEditor"

export default function EditBlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then((d) => { if (d) setPost(d) })
  }, [slug])

  if (notFound) return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
      <p>Post not found</p>
    </div>
  )

  if (!post) return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      Loading post...
    </div>
  )

  // Map DB fields to editor format
  const editorData = {
    ...post,
    intro: post.intro,
    sections: post.sections || [],
  }

  return <BlogEditor initialData={editorData} isEdit />
}
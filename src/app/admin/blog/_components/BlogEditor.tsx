"use client"
import React, { useState, useEffect, useRef } from "react"
import SharedEntityEditor, { FAQItem, SeoFormData } from "../../_components/SharedEntityEditor"
import { invalidateAdminCache } from "../../_lib/admin-cache"

type Props = {
  initialData?: any
  isEdit?: boolean
  onClose?: () => void
  onSaveSuccess?: () => void
}

type LibraryImage = {
  name: string
  url: string
  created_at: string
}

export default function BlogEditor({
  initialData,
  isEdit = false,
  onClose = () => {},
  onSaveSuccess,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form states
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category_id: initialData?.category_id || "",
    featured_image: initialData?.featured_image || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author_name: initialData?.author_name || "Mommantum Team",
    status: initialData?.status || "draft",
  })

  const [imageUrls, setImageUrls] = useState<string[]>([
    initialData?.image_urls?.[0] || "",
    initialData?.image_urls?.[1] || "",
    initialData?.image_urls?.[2] || "",
  ])

  const [categories, setCategories] = useState<any[]>([])

  // Image Library states
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [activeImageTarget, setActiveImageTarget] = useState<
    "featured_image" | "image_url_1" | "image_url_2" | "image_url_3" | "editor" | null
  >(null)
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [librarySearch, setLibrarySearch] = useState("")
  const [copySuccessUrl, setCopySuccessUrl] = useState<string | null>(null)

  // Editor tab inside Article Content
  const [editorTab, setEditorTab] = useState<"html" | "preview">("html")

  const currentSlug = form.slug || initialData?.slug || ""
  const pageKey = currentSlug ? `blog:${currentSlug}` : "blog:new"

  // Fetch product categories on mount
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
  }, [])

  // Fetch Image Library when opened
  useEffect(() => {
    if (isLibraryOpen) {
      setLoadingLibrary(true)
      fetch("/api/admin/blog/images")
        .then((res) => res.json())
        .then((data) => {
          setLibraryImages(Array.isArray(data.images) ? data.images : [])
        })
        .catch(() => {})
        .finally(() => setLoadingLibrary(false))
    }
  }, [isLibraryOpen])

  function updateForm(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "title" && !isEdit) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 80)
      setForm((prev) => ({ ...prev, title: value, slug: generatedSlug }))
    }
  }

  const updateImageUrl = (index: number, val: string) => {
    setImageUrls((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  const triggerImagePicker = (
    target: "featured_image" | "image_url_1" | "image_url_2" | "image_url_3" | "editor" | null
  ) => {
    setActiveImageTarget(target)
    setIsLibraryOpen(true)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      updateForm("content", form.content + "\n" + text)
      return
    }
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = form.content.substring(0, start)
    const after = form.content.substring(end)
    const nextVal = before + text + after
    updateForm("content", nextVal)

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + text.length
      textarea.selectionEnd = start + text.length
    }, 50)
  }

  const handleSelectImage = (url: string) => {
    if (activeImageTarget === "featured_image") {
      updateForm("featured_image", url)
    } else if (activeImageTarget === "image_url_1") {
      updateImageUrl(0, url)
    } else if (activeImageTarget === "image_url_2") {
      updateImageUrl(1, url)
    } else if (activeImageTarget === "image_url_3") {
      updateImageUrl(2, url)
    } else if (activeImageTarget === "editor") {
      insertAtCursor(`<img src="${url}" alt="${form.title}" />`)
      showCopyToast(url)
    }
    setIsLibraryOpen(false)
  }

  const showCopyToast = (url: string) => {
    setCopySuccessUrl(url)
    setTimeout(() => setCopySuccessUrl(null), 2000)
  }

  const handleDeleteImage = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this image permanently?")) return
    try {
      const res = await fetch(`/api/admin/blog/images?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setLibraryImages((prev) => prev.filter((img) => img.name !== name))
      } else {
        alert("Failed to delete image.")
      }
    } catch {
      alert("Network error deleting image.")
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.")
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(",")[1]
      try {
        setUploading(true)
        const res = await fetch("/api/admin/blog/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            data: base64Data,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          setLibraryImages((prev) => [data, ...prev])
        } else {
          alert("Upload failed: " + data.error)
        }
      } catch {
        alert("Network error during file upload.")
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const wrapSelection = (prefix: string, suffix: string, defaultText = "text") => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = form.content.substring(start, end) || defaultText
    const before = form.content.substring(0, start)
    const after = form.content.substring(end)
    const nextVal = before + prefix + selected + suffix + after
    updateForm("content", nextVal)

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + prefix.length
      textarea.selectionEnd = start + prefix.length + selected.length
    }, 50)
  }

  const handleSave = async ({
    seoData,
    faqs,
  }: {
    seoData: SeoFormData
    faqs: FAQItem[]
  }) => {
    if (!form.title.trim()) {
      alert("Title is required")
      return false
    }
    if (!form.slug.trim()) {
      alert("Slug is required")
      return false
    }
    if (!form.excerpt.trim()) {
      alert("Excerpt is required")
      return false
    }
    if (!form.content.trim()) {
      alert("Article Content HTML is required")
      return false
    }

    const cleanSlug = form.slug
      .toLowerCase()
      .trim()
      .replace(/^[/\s]+|[/\s]+$/g, "")
      .replace(/[\s_]+/g, "-")

    const validImageUrls = imageUrls.map((url) => url.trim()).filter(Boolean)
    const cleanFaqs = (faqs || []).filter((faq) => faq.question.trim() || faq.answer.trim())

    // 1. Save Blog Post record
    const blogPayload = {
      ...form,
      slug: cleanSlug,
      meta_title: seoData.meta_title || form.title,
      meta_description: seoData.meta_description || form.excerpt,
      image_urls: validImageUrls,
      faqs: cleanFaqs,
    }

    const method = isEdit ? "PUT" : "POST"
    const url = isEdit ? `/api/admin/blog/${initialData.slug}` : "/api/admin/blog"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogPayload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.error || "Failed to save blog post")
    }

    // 2. Save SEO Record
    const secondaryKeywordsArray =
      typeof seoData.secondary_keywords === "string"
        ? seoData.secondary_keywords.split(",").map((s) => s.trim()).filter(Boolean)
        : seoData.secondary_keywords || []

    const seoPayload = {
      page_key: `blog:${cleanSlug}`,
      page_label: form.title.trim(),
      slug: `/blog/${cleanSlug}`,
      canonical_url: seoData.canonical_url?.trim() || null,
      meta_title: seoData.meta_title?.trim() || form.title.trim(),
      meta_description: seoData.meta_description?.trim() || form.excerpt.trim(),
      primary_keyword: seoData.primary_keyword?.trim() || null,
      secondary_keywords: secondaryKeywordsArray.length ? secondaryKeywordsArray : null,
      robots_index: seoData.robots_index,
      robots_follow: seoData.robots_follow,
      og_title: seoData.og_title?.trim() || form.title.trim(),
      og_description: seoData.og_description?.trim() || form.excerpt.trim(),
      og_image: seoData.og_image?.trim() || form.featured_image?.trim() || null,
      og_type: seoData.og_type || "article",
      twitter_card: seoData.twitter_card || "summary_large_image",
      twitter_title: seoData.twitter_title?.trim() || form.title.trim(),
      twitter_description: seoData.twitter_description?.trim() || form.excerpt.trim(),
      schema_json: seoData.schema_json?.trim() || null,
      faq_section: cleanFaqs.length ? cleanFaqs : null,
    }

    await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seoPayload),
    }).catch(() => {})

    invalidateAdminCache("admin_blog_posts")
    invalidateAdminCache("admin_pages")
    onSaveSuccess?.()
    return true
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] px-4 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#e61e73]"
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400"

  const filteredLibrary = libraryImages.filter((img) =>
    img.name.toLowerCase().includes(librarySearch.toLowerCase())
  )

  return (
    <>
      <SharedEntityEditor
        pageKey={pageKey}
        entityLabelSingular="Blog Post"
        entityLabelPlural="Blog Posts"
        title={form.title || "New Blog Post"}
        slug={currentSlug ? `/blog/${currentSlug}` : ""}
        initialSeoData={{
          canonical_url: initialData?.canonical_url || "",
          meta_title: initialData?.meta_title || initialData?.title || "",
          meta_description: initialData?.meta_description || initialData?.excerpt || "",
          primary_keyword: initialData?.primary_keyword || "",
          secondary_keywords: initialData?.secondary_keywords || "",
          robots_index: initialData?.robots_index ?? true,
          robots_follow: initialData?.robots_follow ?? true,
          og_title: initialData?.og_title || initialData?.title || "",
          og_description: initialData?.og_description || initialData?.excerpt || "",
          og_image: initialData?.og_image || initialData?.featured_image || "",
          og_type: initialData?.og_type || "article",
          twitter_card: initialData?.twitter_card || "summary_large_image",
          twitter_title: initialData?.twitter_title || initialData?.title || "",
          twitter_description: initialData?.twitter_description || initialData?.excerpt || "",
          schema_json: initialData?.schema_json || "",
        }}
        initialFaqs={initialData?.faqs || []}
        hasContentTab={true}
        contentTabLabel="Article & Content"
        defaultTab="general"
        onClose={onClose}
        onSave={handleSave}
        renderContentTab={() => (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                Article Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Post Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="e.g. 7 High-Converting D2C Creative Frameworks"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>URL Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateForm("slug", e.target.value)}
                    placeholder="e.g. high-converting-d2c-creative-frameworks"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm("category_id", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c: any) => (
                      <option key={c.id || c.name} value={c.name || c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="D2C Marketing">D2C Marketing</option>
                    <option value="Creative Strategy">Creative Strategy</option>
                    <option value="Paid Ads">Paid Ads</option>
                    <option value="SEO & AEO">SEO & AEO</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Author Name</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => updateForm("author_name", e.target.value)}
                    placeholder="e.g. Kuldeep Ahir"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Publication Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Featured Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.featured_image}
                    onChange={(e) => updateForm("featured_image", e.target.value)}
                    placeholder="https://... /cover.webp"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => triggerImagePicker("featured_image")}
                    className="rounded-[10px] bg-[#1f2937] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#2d3a4f] shrink-0 border border-slate-700/50 cursor-pointer"
                  >
                    Media Library
                  </button>
                </div>
                {form.featured_image && (
                  <div className="mt-2 h-28 w-48 rounded-[8px] overflow-hidden border border-[#1f2937] bg-slate-900">
                    <img
                      src={form.featured_image}
                      alt="Featured Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Article Excerpt / Summary *</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => updateForm("excerpt", e.target.value)}
                  placeholder="2-3 sentence overview that appears in blog listings and meta preview..."
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Article Content with Rich HTML Toolbar */}
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
                <h3 className="text-[15px] font-bold text-white">Article Content (HTML)</h3>
                <div className="flex items-center gap-1 bg-[#0b0f17] p-1 rounded-[8px] border border-[#1f2937]">
                  <button
                    type="button"
                    onClick={() => setEditorTab("html")}
                    className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-all cursor-pointer ${
                      editorTab === "html" ? "bg-[#e61e73] text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    HTML Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-all cursor-pointer ${
                      editorTab === "preview" ? "bg-[#e61e73] text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {editorTab === "html" ? (
                <div className="space-y-2">
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-[10px] bg-[#0b0f17] border border-[#1f2937]">
                    <button
                      type="button"
                      onClick={() => wrapSelection("<h2>", "</h2>", "Section Heading")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert H2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection("<h3>", "</h3>", "Sub-heading")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert H3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection("<strong>", "</strong>", "bold text")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection("<em>", "</em>", "italic text")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer italic"
                      title="Insert Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection('<a href="https://..." target="_blank">', "</a>", "link text")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert Link"
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection("<ul>\n  <li>", "</li>\n</ul>", "List item")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert List"
                    >
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => wrapSelection("<blockquote>", "</blockquote>", "Quote")}
                      className="px-2.5 py-1 rounded bg-[#1f2937] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-[#283548] transition-colors cursor-pointer"
                      title="Insert Quote"
                    >
                      Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerImagePicker("editor")}
                      className="px-2.5 py-1 rounded bg-[#e61e73]/20 border border-[#e61e73]/40 text-[11px] font-bold text-[#e61e73] hover:bg-[#e61e73]/30 transition-colors cursor-pointer"
                      title="Insert Image from Supabase Library"
                    >
                      + Image
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={18}
                    value={form.content}
                    onChange={(e) => updateForm("content", e.target.value)}
                    placeholder="<p>Write your article content with standard HTML tags...</p>"
                    className="w-full rounded-[10px] border border-[#1f2937] bg-[#0b0f17] p-4 text-[13px] text-slate-200 font-mono outline-none focus:border-[#e61e73] transition-all leading-relaxed"
                    spellCheck={false}
                    required
                  />
                </div>
              ) : (
                <div
                  className="rounded-[10px] border border-[#1f2937] bg-[#0b0f17] p-6 max-h-[500px] overflow-y-auto prose prose-invert max-w-none text-slate-300"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              )}
            </div>

            {/* Supplemental Images */}
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-white border-b border-[#1f2937] pb-3">
                Supplemental Images (In-Article Callouts)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className={labelClass}>Callout Image #{idx + 1}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageUrls[idx]}
                        onChange={(e) => updateImageUrl(idx, e.target.value)}
                        placeholder={`https://... /img-${idx + 1}.webp`}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          triggerImagePicker(`image_url_${idx + 1}` as any)
                        }
                        className="rounded-[8px] bg-[#1f2937] px-2.5 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
                      >
                        Pick
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      />

      {/* ── Supabase Media Library Modal ── */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-[18px] border border-[#1f2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f2937]">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">Supabase Image Library</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Click an image to select it or insert it into the editor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="text-slate-400 hover:text-white text-[20px] font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Upload & Search controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
              <input
                type="text"
                placeholder="Search images..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full sm:w-64 rounded-[8px] border border-[#1f2937] bg-[#0b0f17] px-3 py-1.5 text-[12px] text-white outline-none focus:border-[#e61e73]"
              />
              <label className="rounded-[8px] bg-[#e61e73] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#ca155f] cursor-pointer transition-all self-stretch sm:self-auto text-center">
                {uploading ? "Uploading..." : "+ Upload New Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Grid */}
            <div className="max-h-96 overflow-y-auto">
              {loadingLibrary ? (
                <div className="py-16 text-center text-slate-400">Loading images...</div>
              ) : filteredLibrary.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-[13px]">
                  No images found in storage.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredLibrary.map((img) => (
                    <div
                      key={img.name}
                      onClick={() => handleSelectImage(img.url)}
                      className="group relative rounded-[10px] border border-[#1f2937] bg-[#0b0f17] p-2 hover:border-[#e61e73] cursor-pointer transition-all flex flex-col items-center"
                    >
                      <div className="h-28 w-full rounded-[6px] overflow-hidden bg-slate-900 mb-2">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-300 truncate w-full text-center">
                        {img.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteImage(img.name, e)}
                        className="absolute top-3 right-3 rounded bg-black/70 p-1 text-slate-400 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1f2937] flex justify-end">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
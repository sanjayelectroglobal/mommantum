"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAdminPath } from "@lib/hooks/use-admin-path"

type FAQ = { question: string; answer: string }

type Props = {
  initialData?: any
  isEdit?: boolean
}

type LibraryImage = {
  name: string
  url: string
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM ICONS
// ─────────────────────────────────────────────────────────────────────────────
const FolderIcon = () => (
  <svg className="w-4 h-4 mr-1.5 text-amber-400 fill-current" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
)

const ImageIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} text-rose-400 hover:text-rose-500 cursor-pointer transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5 text-slate-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function BlogEditor({ initialData, isEdit = false }: Props) {
  const router = useRouter()
  const { prefixPath } = useAdminPath()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Saving states
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")

  // Form states
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category_id: initialData?.category_id || "",
    featured_image: initialData?.featured_image || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author_name: initialData?.author_name || "Mommantum Team",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    status: initialData?.status || "draft",
  })

  const [imageUrls, setImageUrls] = useState<string[]>([
    initialData?.image_urls?.[0] || "",
    initialData?.image_urls?.[1] || "",
    initialData?.image_urls?.[2] || "",
  ])

  const [faqs, setFaqs] = useState<FAQ[]>(initialData?.faqs || [])

  // Categories list
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

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

  // Editor pane states
  const [editorTab, setEditorTab] = useState<"html" | "preview">("html")

  // Full-Screen Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Fetch product categories on mount
  useEffect(() => {
    setLoadingCategories(true)
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoadingCategories(false))
  }, [])

  // Fetch Image Library from Supabase bucket when opened
  useEffect(() => {
    if (isLibraryOpen) {
      fetchLibraryImages()
    }
  }, [isLibraryOpen])

  function fetchLibraryImages() {
    setLoadingLibrary(true)
    fetch("/api/admin/blog/images")
      .then((res) => res.json())
      .then((data) => {
        setLibraryImages(Array.isArray(data.images) ? data.images : [])
      })
      .catch((err) => console.error("Error fetching library:", err))
      .finally(() => setLoadingLibrary(false))
  }

  function updateForm(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "title" && !isEdit) {
      // auto-generate slug
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

  // ─────────────────────────────────────────────────────────────────────────────
  // FAQ UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────
  function addFaq() {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  function updateFaq(index: number, field: "question" | "answer", val: string) {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: val } : faq))
    )
  }

  function removeFaq(index: number) {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  function moveFaqUp(index: number) {
    if (index === 0) return
    setFaqs((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index - 1]
      next[index - 1] = temp
      return next
    })
  }

  function moveFaqDown(index: number) {
    if (index === faqs.length - 1) return
    setFaqs((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index + 1]
      next[index + 1] = temp
      return next
    })
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // IMAGE LIBRARY ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const triggerImagePicker = (
    target: "featured_image" | "image_url_1" | "image_url_2" | "image_url_3" | "editor" | null
  ) => {
    setActiveImageTarget(target)
    setIsLibraryOpen(true)
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
      navigator.clipboard.writeText(`<img src="${url}" alt="${form.title}" />`)
      showCopyToast(url)
    } else {
      // General Copy
      navigator.clipboard.writeText(url)
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

  // Delete post from editor
  async function handleDeletePost() {
    if (!isEdit || !form.slug) return
    if (!confirm(`Are you sure you want to delete "${form.title || form.slug}"? This cannot be undone.`)) return
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/blog/${form.slug}`, { method: "DELETE" })
      if (res.ok) {
        router.push(prefixPath("/admin/blog"))
        router.refresh()
      } else {
        alert("Failed to delete post")
      }
    } catch {
      alert("Network error deleting post")
    } finally {
      setSaving(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SAVE FORM
  // ─────────────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.title.trim()) {
      alert("Title is required")
      return
    }
    if (!form.slug.trim()) {
      alert("Slug is required")
      return
    }
    if (!form.excerpt.trim()) {
      alert("Excerpt is required")
      return
    }
    if (!form.content.trim()) {
      alert("Article Content HTML is required")
      return
    }

    setSaving(true)
    setSavedMsg("")

    // filter empty strings out of image_urls array
    const validImageUrls = imageUrls.map((url) => url.trim()).filter(Boolean)
    // filter blank FAQs
    const validFaqs = faqs.filter((faq) => faq.question.trim() || faq.answer.trim())

    const payload = {
      ...form,
      image_urls: validImageUrls,
      faqs: validFaqs,
    }

    const currentSlug = initialData?.slug || form.slug
    const url = isEdit
      ? `/api/admin/blog/${currentSlug}`
      : "/api/admin/blog"
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSavedMsg(isEdit ? "Changes saved successfully!" : "Post created successfully!")
        setTimeout(() => setSavedMsg(""), 3500)
        router.refresh()
        if (!isEdit && data.data?.slug) {
          router.push(prefixPath(`/admin/blog/${data.data.slug}`))
        } else if (isEdit && form.slug !== currentSlug) {
          router.push(prefixPath(`/admin/blog/${form.slug}`))
        }
      } else {
        alert("Error: " + (data.error || JSON.stringify(data)))
      }
    } catch (err) {
      alert("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  // Filtered images for search inside library
  const filteredLibraryImages = libraryImages.filter((img) =>
    img.name.toLowerCase().includes(librarySearch.toLowerCase())
  )

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151] focus:ring-2 focus:ring-[#374151]/20"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="mx-auto max-w-[900px] text-slate-200">
      {/* ─────────────────────────────────────────────────────────────────────────────
          HEADER
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white leading-none">
            {isEdit ? "Edit Post" : "New Blog Post"}
          </h1>
          {form.slug && (
            <p className="mt-2 text-[13px] text-slate-400 font-medium font-mono">
              /{form.slug}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {savedMsg && (
            <span className="text-[13px] font-semibold text-emerald-400 animate-pulse">
              ✓ {savedMsg}
            </span>
          )}
          {isEdit && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:bg-[#1f2937] hover:text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              View Live ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:bg-[#1f2937] hover:text-white transition-all shadow-sm"
          >
            Show Preview
          </button>
          <button
            type="button"
            onClick={() => router.push(prefixPath("/admin/blog"))}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:bg-[#1f2937] hover:text-white transition-all shadow-sm"
          >
            ← Back
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDeletePost}
              disabled={saving}
              className="rounded-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-4 py-2 text-[13px] font-semibold transition-all shadow-sm"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#e61e73] hover:bg-[#ca155f] text-white border border-[#e61e73]/40 px-5 py-2 text-[13px] font-bold disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* ─────────────────────────────────────────────────────────────────────────────
            BASIC INFO CARD
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="mb-5 text-[15px] font-extrabold text-white">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="What Is the Advantage of Automation In Driving Business Growth"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                placeholder="advantage-automation-business-growth-800681"
                className={inputClass}
              />
              {form.slug && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  URL: /blog/{form.slug}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer font-bold ${
                    form.status === "published" ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  <option value="draft" className="text-amber-400 bg-[#111827]">
                    Draft 📝
                  </option>
                  <option value="published" className="text-emerald-400 bg-[#111827]">
                    Published 🚀
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => updateForm("category_id", e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Select category</option>
                  {loadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className={labelClass}>Author Name</label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={(e) => updateForm("author_name", e.target.value)}
                  placeholder="Mommantum Team"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
                placeholder="Discover what is the advantage of automation and how an automation engineer can boost your business..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            IMAGES CARD
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-extrabold text-white">Images</h2>
            <button
              type="button"
              onClick={() => triggerImagePicker(null)}
              className="flex items-center rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3.5 py-1.5 text-[12px] font-bold text-white hover:border-[#374151] hover:bg-[#1f2937] transition-all shadow-sm"
            >
              <FolderIcon /> Open Image Library
            </button>
          </div>
          <p className="text-[12px] text-slate-400 mb-6">
            Paste a URL directly or click the 🖼️ thumbnail to pick from your Supabase library
          </p>

          <div className="space-y-4">
            {/* FEATURED IMAGE COVER */}
            <div>
              <label className={labelClass}>Featured Image (cover)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={form.featured_image}
                  onChange={(e) => updateForm("featured_image", e.target.value)}
                  placeholder="Paste URL or click thumbnail"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => triggerImagePicker("featured_image")}
                  className="w-[46px] h-[46px] rounded-[12px] bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 hover:bg-[#f8fafc] overflow-hidden transition-all shadow-sm"
                  title="Choose Cover Image"
                >
                  {form.featured_image ? (
                    <img src={form.featured_image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* IMAGE URL 1 */}
            <div>
              <label className={labelClass}>Image URL 1 (shown below article)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrls[0]}
                  onChange={(e) => updateImageUrl(0, e.target.value)}
                  placeholder="Paste URL or click thumbnail"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => triggerImagePicker("image_url_1")}
                  className="w-[46px] h-[46px] rounded-[12px] bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 hover:bg-[#f8fafc] overflow-hidden transition-all shadow-sm"
                  title="Choose Image 1"
                >
                  {imageUrls[0] ? (
                    <img src={imageUrls[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* IMAGE URL 2 */}
            <div>
              <label className={labelClass}>Image URL 2 (shown below article)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrls[1]}
                  onChange={(e) => updateImageUrl(1, e.target.value)}
                  placeholder="Paste URL or click thumbnail"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => triggerImagePicker("image_url_2")}
                  className="w-[46px] h-[46px] rounded-[12px] bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 hover:bg-[#f8fafc] overflow-hidden transition-all shadow-sm"
                  title="Choose Image 2"
                >
                  {imageUrls[1] ? (
                    <img src={imageUrls[1]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* IMAGE URL 3 */}
            <div>
              <label className={labelClass}>Image URL 3 (shown below article)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrls[2]}
                  onChange={(e) => updateImageUrl(2, e.target.value)}
                  placeholder="Paste URL or click thumbnail"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => triggerImagePicker("image_url_3")}
                  className="w-[46px] h-[46px] rounded-[12px] bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 hover:bg-[#f8fafc] overflow-hidden transition-all shadow-sm"
                  title="Choose Image 3"
                >
                  {imageUrls[2] ? (
                    <img src={imageUrls[2]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            ARTICLE CONTENT CARD
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="text-[15px] font-extrabold text-white">Article Content</h2>
          <p className="text-[12px] text-slate-400 mb-4">
            Use toolbar for headings, bold, lists, inline images
          </p>

          <div className="rounded-[14px] border border-[#1f2937] bg-[#111827] overflow-hidden">
            {/* EDITOR TOOLBAR */}
            <div className="flex items-center justify-between border-b border-[#1f2937] bg-[#111827] p-2.5">
              <div className="flex gap-1 bg-[#1f2937]/50 rounded-[10px] p-1 border border-[#1f2937]">
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`rounded-[8px] px-4 py-1.5 text-[12px] font-semibold transition-all ${
                    editorTab === "preview"
                      ? "bg-[#1e3a8a] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  👁 Preview
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("html")}
                  className={`rounded-[8px] px-4 py-1.5 text-[12px] font-semibold transition-all ${
                    editorTab === "html"
                      ? "bg-[#1e3a8a] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  &lt;/&gt; HTML
                </button>
              </div>

              <button
                type="button"
                onClick={() => triggerImagePicker("editor")}
                className="flex items-center gap-1.5 rounded-[8px] border border-[#1f2937] bg-[#1f2937]/50 px-3.5 py-1.5 text-[12px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all shadow-sm"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Image
              </button>
            </div>

            {/* CONTENT AREA */}
            <div>
              {editorTab === "html" ? (
                <textarea
                  ref={textareaRef}
                  value={form.content}
                  onChange={(e) => updateForm("content", e.target.value)}
                  placeholder="<p>Write your article here, supporting standard HTML tags...</p>"
                  rows={14}
                  className="w-full border-none bg-transparent px-4 py-4 text-[13px] text-white outline-none font-mono placeholder:text-slate-600 focus:ring-0"
                />
              ) : (
                <div className="min-h-[300px] max-h-[500px] overflow-y-auto bg-white text-slate-800 p-6 prose max-w-none">
                  {form.content ? (
                    <div
                      className="blog-content-preview"
                      dangerouslySetInnerHTML={{ __html: form.content }}
                    />
                  ) : (
                    <p className="text-slate-400 italic text-[14px]">No content written yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            FAQS CARD
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="text-[15px] font-extrabold text-white">FAQs</h2>
          <p className="text-[12px] text-slate-400 mb-6">
            Shown at the bottom of the article — improves SEO
          </p>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-[16px] bg-[#182235]/60 border border-[#2d3a52]/40 p-5 shadow-sm space-y-4 relative"
              >
                {/* Header controls */}
                <div className="flex items-center justify-between border-b border-[#2d3a52]/20 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e61e73] text-[13px] font-bold text-white shadow-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[14px] font-bold text-white max-w-[450px] truncate">
                      {faq.question || "New FAQ Item"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveFaqUp(i)}
                      disabled={i === 0}
                      className="p-1.5 rounded-[6px] border border-[#2d3a52]/30 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFaqDown(i)}
                      disabled={i === faqs.length - 1}
                      className="p-1.5 rounded-[6px] border border-[#2d3a52]/30 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="p-1.5 rounded-[6px] border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 transition-all ml-1"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* FAQ Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400">
                      QUESTION *
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      placeholder="What is the biggest advantage of automation for D2C brands?"
                      className="w-full rounded-[10px] border border-[#2d3a52]/60 bg-[#111827] px-4 py-2.5 text-[13px] text-white outline-none focus:border-slate-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400">
                      ANSWER *
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      placeholder="The best thing about automation is how it makes life easier for D2C brands..."
                      rows={3}
                      className="w-full rounded-[10px] border border-[#2d3a52]/60 bg-[#111827] px-4 py-2.5 text-[13px] text-white outline-none focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}

            {faqs.length === 0 && (
              <p className="text-[12px] text-slate-500 italic text-center py-4">
                No FAQs added to this article yet. Click below to add.
              </p>
            )}

            <button
              type="button"
              onClick={addFaq}
              className="w-full flex items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#1f2937] hover:border-[#374151] bg-[#111827]/40 hover:bg-[#111827] py-4 text-[13px] font-semibold text-slate-400 hover:text-white transition-all"
            >
              + Add FAQ Item
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            META SETTINGS (SEO) CARD
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937]">
          <h2 className="mb-5 text-[15px] font-extrabold text-white">Meta Settings (SEO)</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => updateForm("meta_title", e.target.value)}
                placeholder="Enter search-engine title..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => updateForm("meta_description", e.target.value)}
                placeholder="Enter search-engine snippet description..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            BOTTOM BUTTONS
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pb-12">
          <button
            type="button"
            onClick={() => router.push(prefixPath("/admin/blog"))}
            className="rounded-[10px] border border-[#1f2937] bg-[#1f2937]/50 px-5 py-2.5 text-[13px] font-semibold text-slate-300 hover:border-[#374151] hover:text-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-[10px] bg-[#374151] hover:bg-[#4b5563] text-white border border-[#4b5563]/40 px-7 py-2.5 text-[13px] font-semibold disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          IMAGE LIBRARY MODAL
          ───────────────────────────────────────────────────────────────────────────── */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[800px] max-h-[90vh] flex flex-col rounded-[24px] bg-[#111827] border border-[#1f2937] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1f2937] px-6 py-5">
              <div>
                <h3 className="text-[18px] font-bold text-white leading-none">
                  Supabase Image Library
                </h3>
                <p className="text-[12px] text-slate-400 mt-1.5">
                  Upload files to Supabase bucket or pick an existing image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 rounded-lg hover:bg-[#1f2937] transition-all"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#1f2937] hover:border-[#374151] bg-[#111827]/50 rounded-[18px] p-6 text-center transition-all relative flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-[32px] mb-2">📁</span>
                <p className="text-[13px] font-semibold text-slate-200">
                  {uploading ? "Uploading to Supabase..." : "Click or drag images to upload"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP, GIF (Max 10MB)
                </p>
                {uploading && (
                  <div className="absolute inset-0 bg-[#111827]/80 rounded-[18px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#e61e73] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Toolbar & Search */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search images by name..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchLibraryImages}
                  className="p-3 rounded-[12px] bg-[#1f2937] border border-[#1f2937] hover:border-[#374151] hover:text-white transition-all text-slate-300"
                  title="Reload Images"
                >
                  🔄
                </button>
              </div>

              {/* Image Grid */}
              {loadingLibrary ? (
                <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-[#e61e73] border-t-transparent rounded-full animate-spin" />
                  <span>Loading Supabase gallery...</span>
                </div>
              ) : filteredLibraryImages.length === 0 ? (
                <div className="py-20 text-center text-slate-500 italic">
                  {librarySearch ? "No images matches search query." : "No images in the library. Upload one above!"}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredLibraryImages.map((img) => (
                    <div
                      key={img.name}
                      onClick={() => handleSelectImage(img.url)}
                      className="group cursor-pointer rounded-[14px] bg-[#1f2937]/30 border border-[#1f2937] hover:border-slate-500 overflow-hidden transition-all relative flex flex-col aspect-square shadow-sm"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover flex-1" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                          {activeImageTarget ? "Insert Image" : "Copy URL"}
                        </span>
                      </div>
                      <div className="bg-[#111827]/90 p-2 flex items-center justify-between border-t border-[#1f2937]">
                        <span className="text-[10px] font-mono truncate max-w-[110px] text-slate-400" title={img.name}>
                          {img.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteImage(img.name, e)}
                          className="p-1 rounded hover:bg-[#1f2937] transition-all flex items-center justify-center"
                          title="Delete from Library"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          FULL-SCREEN PREVIEW MODAL
          ───────────────────────────────────────────────────────────────────────────── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f3f4f6] text-slate-800 animate-in fade-in duration-200">
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div>
              <span className="text-[12px] bg-slate-800 px-2.5 py-1 rounded-[6px] font-mono text-emerald-400 font-bold mr-3 border border-slate-700">
                PREVIEW MODE
              </span>
              <span className="text-[14px] font-bold text-slate-200 hidden sm:inline-block">
                {form.title || "Untitled Post"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-[10px] bg-[#e61e73] hover:bg-[#ca155f] text-white px-5 py-2.5 text-[13px] font-bold transition-all shadow-sm"
            >
              Close Preview
            </button>
          </div>

          {/* Render detail page replica */}
          <main className="relative overflow-hidden bg-[#f3f4f6] pt-14 pb-20 lg:pt-18 lg:pb-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[4%] top-[5%] h-[180px] w-[500px] rounded-full bg-white/50 blur-3xl" />
              <div className="absolute right-[6%] top-[8%] h-[160px] w-[400px] rounded-full bg-white/40 blur-3xl" />
            </div>

            <style>{`
              .blog-content { font-family: inherit; }
              .blog-content h2 {
                font-size: 22px; font-weight: 800; color: #0e2547;
                letter-spacing: -0.04em; margin: 32px 0 14px; line-height: 1.1;
                padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;
              }
              @media (min-width: 768px) {
                .blog-content h2 { font-size: 26px; margin: 40px 0 16px; }
              }
              .blog-content h3 { font-size: 18px; font-weight: 700; color: #0e2547; margin: 24px 0 10px; line-height: 1.2; }
              @media (min-width: 768px) {
                .blog-content h3 { font-size: 20px; margin: 28px 0 10px; }
              }
              .blog-content p  { font-size: 15px; line-height: 1.8; color: #475569; margin: 12px 0; }
              @media (min-width: 768px) {
                .blog-content p { font-size: 16px; line-height: 2; margin: 14px 0; }
              }
              .blog-content strong { font-weight: 700; color: #0e2547; }
              .blog-content em { font-style: italic; }
              .blog-content ul { list-style: none; padding: 0; margin: 16px 0; }
              .blog-content ul li {
                display: flex; align-items: flex-start; gap: 10px;
                font-size: 15px; line-height: 1.7; color: #475569;
                margin: 8px 0; padding: 10px 12px;
                background: #f8fafc; border-radius: 10px; border-left: 3px solid #e61e73;
              }
              .blog-content ul li::before {
                content: ""; display: inline-block; width: 6px; height: 6px;
                border-radius: 50%; background: #e61e73; flex-shrink: 0; margin-top: 8px;
              }
              .blog-content ol { padding-left: 0; margin: 16px 0; counter-reset: ol-counter; list-style: none; }
              .blog-content ol li {
                counter-increment: ol-counter; display: flex; align-items: flex-start;
                gap: 12px; font-size: 15px; line-height: 1.7; color: #475569;
                margin: 8px 0; padding: 10px 12px; background: #f8fafc; border-radius: 10px;
              }
              .blog-content ol li::before {
                content: counter(ol-counter); display: flex; align-items: center;
                justify-content: center; min-width: 24px; height: 24px;
                border-radius: 50%; background: #0e2547; color: white;
                font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
              }
              .blog-content blockquote {
                border-left: 3px solid #e61e73; padding: 14px 16px; margin: 20px 0;
                background: linear-gradient(135deg,#fff5f8 0%,#fff0f5 100%);
                border-radius: 0 10px 10px 0; color: #475569;
                font-size: 15px; line-height: 1.7; font-style: italic;
              }
              .blog-content a { color: #e61e73; text-decoration: none; font-weight: 600; }
              .blog-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 20px auto; display: block; }
            `}</style>

            <div className="content-container relative px-4 sm:px-6 lg:px-10">
              <div className="mx-auto max-w-[1180px]">
                {/* Back button */}
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-400 transition-colors">
                  <span className="text-[18px]">←</span> Back to Blog
                </span>

                {/* Post Header */}
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {form.category_id && (
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-[13px] text-white sm:px-4 sm:text-[14px]"
                        style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                      >
                        {form.category_id}
                      </span>
                    )}
                    <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-slate-400 sm:text-[13px]">
                      {new Date().toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h1 className="mt-4 max-w-[820px] text-[28px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0e2547] sm:mt-5 sm:text-[36px] lg:text-[54px]">
                    {form.title || "Post Title Preview"}
                  </h1>

                  {form.excerpt && (
                    <p className="mt-4 max-w-[700px] text-[15px] leading-[1.7] text-slate-600 sm:mt-5 sm:text-[17px] sm:leading-[1.85]">
                      {form.excerpt}
                    </p>
                  )}
                </div>

                {/* Main Content Layout */}
                <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
                  {/* Article Card */}
                  <div className="min-w-0">
                    <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:rounded-[24px]">
                      <div
                        className="h-[4px] w-full"
                        style={{ background: "linear-gradient(90deg, #e61e73, #9333ea, #0ea5e9)" }}
                      />
                      <div className="p-5 sm:p-7 lg:p-12">
                        {form.featured_image && (
                          <div className="mb-8 overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:mb-10 lg:rounded-[24px]">
                            <div className="relative aspect-[16/9] w-full">
                              <img
                                src={form.featured_image}
                                alt="Cover"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {form.content ? (
                          <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: form.content }}
                          />
                        ) : (
                          <p className="text-[16px] text-slate-400 italic">
                            Content preview empty.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Extra Images */}
                    {imageUrls.filter(Boolean).length > 0 && (
                      <div className="mt-8 lg:mt-10">
                        <p className="mb-5 text-[16px] text-[#e61e73] font-bold lg:mb-6 lg:text-[18px]">
                          More from this article
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                          {imageUrls.filter(Boolean).map((img, idx) => (
                            <div key={idx} className="overflow-hidden rounded-[16px] shadow-md bg-white border border-slate-200">
                              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full object-cover aspect-video" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQs Section */}
                    {faqs.filter((f) => f.question.trim()).length > 0 && (
                      <div className="mt-12">
                        <p className="mb-6 text-[18px] text-[#e61e73] font-bold">Frequently Asked Questions</p>
                        <div className="space-y-4">
                          {faqs
                            .filter((f) => f.question.trim())
                            .map((faq, idx) => (
                              <div key={idx} className="rounded-[16px] bg-white border border-slate-200 p-6 shadow-sm">
                                <h4 className="text-[16px] font-extrabold text-[#0e2547] flex gap-2">
                                  <span className="text-[#e61e73] font-mono">Q.</span> {faq.question}
                                </h4>
                                <p className="mt-3 text-[15px] leading-[1.65] text-slate-600 pl-5 border-l border-slate-200">
                                  {faq.answer}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Mock */}
                  <aside className="hidden lg:block">
                    <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6">
                      <div className="mb-5 flex items-center gap-2.5">
                        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-slate-900">
                          <span>🔥</span>
                        </div>
                        <h2 className="text-[18px] font-extrabold text-[#0e2547]">Popular Articles</h2>
                      </div>
                      <div className="text-[13px] text-slate-400 space-y-3">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                          What Is the Advantage of Automation in Business...
                        </div>
                        <div className="p-2.5 rounded-lg hover:bg-slate-50 text-slate-600">
                          Top 10 Medusa Store Tips and Tricks...
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
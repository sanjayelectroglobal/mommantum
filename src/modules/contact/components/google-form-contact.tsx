"use client"

import { useRef, useState } from "react"

export default function GoogleFormContact() {
  const formRef = useRef<HTMLFormElement | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setStatus("")

    const form = formRef.current
    if (!form) return

    form.submit()

    setTimeout(() => {
      setLoading(false)
      setStatus("Message sent successfully!")

      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1000)
  }

  return (
    <div className="mx-auto mt-10 max-w-[960px] rounded-[22px] bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.07)] lg:p-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        action="https://docs.google.com/forms/d/e/1FAIpQLSem6lb8eN0u1fpRKFP4r6dEGe4MosfuycS5sKs6kH5aS6uGSQ/formResponse"
        method="POST"
        target="hidden_iframe"
      >
        <input type="hidden" name="entry.1367143699" value={name} readOnly />
        <input type="hidden" name="entry.1044504228" value={email} readOnly />
        <input type="hidden" name="entry.737988115" value={subject} readOnly />
        <input type="hidden" name="entry.506165373" value={message} readOnly />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]">
                Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/30"
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/30"
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Project inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/30"
                required
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-[#0e2547]">
                Message *
              </label>
              <textarea
                placeholder="Tell us about your brand, goals, or what help you need..."
                rows={9}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-[12px] border border-slate-200 bg-[#f9f9fb] px-4 py-3 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#99dcf8] focus:ring-2 focus:ring-[#99dcf8]/30"
                required
                suppressHydrationWarning={true}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          <p className="text-[13px]text-slate-600">
            Your details will be submitted securely.
          </p>

          <button
            type="submit"
            className="inline-flex h-[50px] items-center justify-center rounded-[12px] bg-[#e61e73] px-8 text-[14px] font-extrabold uppercase tracking-[0.03em] text-white transition-all duration-300 hover:bg-[#ca155f]"
            disabled={loading}
            suppressHydrationWarning={true}
          >
            {loading ? "Sending..." : "Send Message"}
            <span className="ml-2.5 text-[18px] leading-none">›</span>
          </button>
        </div>
      </form>

      <iframe name="hidden_iframe" style={{ display: "none" }} />

      {status && (
        <p className="mt-4 text-center text-green-600 font-medium">
          {status}
        </p>
      )}
    </div>
  )
}
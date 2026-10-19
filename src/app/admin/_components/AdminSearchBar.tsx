/**
 * AdminSearchBar & AdminEmptySearch Components
 * 
 * Purpose:
 * Reusable, standardized search input and empty-state display for all Admin table views
 * (Services, Blog, SEO, Users, Case Studies).
 * 
 * Features:
 * - Real-time query binding with instant clear button (X icon).
 * - Styled consistently with Medusa/Mommantum dark admin aesthetic.
 * - Accessible empty state informing the user when zero search results match their filter.
 */

"use client"
import React from "react"
import { Search, X } from "lucide-react"

interface AdminSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AdminSearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: AdminSearchBarProps) {
  return (
    <div className={`relative w-48 sm:w-64 md:w-72 shrink-0 ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-[#1f2937] bg-[#111827] pl-8 pr-7 py-2 text-[12.5px] text-white placeholder-slate-500 focus:border-[#e61e73] focus:outline-none focus:ring-1 focus:ring-[#e61e73] transition-all shadow-sm h-[38px]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-[#1f2937] transition-all"
          title="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export function AdminEmptySearch({
  query,
  onClear,
  label = "items",
}: {
  query: string
  onClear: () => void
  label?: string
}) {
  return (
    <div className="mt-8 rounded-[18px] border border-[#1f2937] bg-[#111827] p-12 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2937] text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <p className="text-[14px] font-medium text-slate-300">
        No {label} matching &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1 text-[12.5px] text-slate-500">
        Try checking for typos or searching for a different keyword.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 inline-flex items-center gap-1.5 rounded-[10px] bg-[#1f2937] px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-[#283548] hover:text-[#e61e73] transition-all border border-slate-700/50"
      >
        Clear Search
      </button>
    </div>
  )
}

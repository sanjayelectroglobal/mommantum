"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Search as SearchIcon, 
  ShoppingCart, 
  Tag, 
  Box, 
  Users, 
  Ticket, 
  Coins, 
  Globe, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Minus,
  Plus,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Map
} from "lucide-react"
import { rolesConfig, isPathAllowed } from "@lib/config/roles"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [adminPath, setAdminPath] = useState<string>("admin")
  const [loading, setLoading] = useState(true)

  // Expand/collapse states for sections
  const [extensionsOpen, setExtensionsOpen] = useState(true)
  const [metaObjectsOpen, setMetaObjectsOpen] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          const pathSegments = window.location.pathname.split("/").filter(Boolean)
          const currentRoot = pathSegments[0] || "admin"
          router.push(`/${currentRoot}`)
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setRole(data.role)
          setEmail(data.email)
          if (data.customAdminPath) {
            setAdminPath(data.customAdminPath)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        const pathSegments = window.location.pathname.split("/").filter(Boolean)
        const currentRoot = pathSegments[0] || "admin"
        router.push(`/${currentRoot}`)
      })
  }, []) // Empty dependency array prevents re-executing auth fetch on every navigation

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push(`/${adminPath}`)
    router.refresh()
  }

  const prefixPath = (href: string) => {
    if (adminPath === "admin") return href
    return href.replace(/^\/admin/, `/${adminPath}`)
  }

  const isActive = (href: string, exact = false) => {
    const prefixed = prefixPath(href)
    if (exact) {
      return pathname === prefixed
    }
    return pathname.startsWith(prefixed)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19]">
        <div className="text-center text-slate-400">Loading admin panel...</div>
      </div>
    )
  }

  // All sub-items under Meta Objects are visible based on role permission configuration
  const permissions = role ? rolesConfig[role] : null
  const allowedFrontendPaths = permissions?.allowedFrontendPaths || []
  const showLink = (href: string) => {
    return isPathAllowed(href, allowedFrontendPaths)
  }

  const metaObjectsItems = [
    { label: "Collections", href: "/admin/collections" },
    { label: "Categories", href: "/admin/categories" },
    { label: "User Management", href: "/admin/users" },
  ].filter((item) => showLink(item.href))

  return (
    <div className="flex min-h-screen bg-[#090d16] text-[#e2e8f0]">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-[230px] flex-col bg-[#0f1420] border-r border-[#1e2638] px-3 py-4 select-none">

        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#e61e73]">
              <span className="text-[11px] font-extrabold text-white">M</span>
            </div>
            <span className="text-[13px] font-bold text-white tracking-wide">Mommantum Store</span>
          </div>
          <span className="text-slate-500 text-[10px] cursor-pointer hover:text-white transition-colors">▼</span>
        </div>

        {/* User Info (Subtle) */}
        {email && (
          <div className="mx-2 mb-4 px-2.5 py-2 rounded-[8px] bg-[#1a2336]/40 border border-[#263550]/40 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="truncate font-semibold text-slate-300" title={email}>{email.split("@")[0]}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#e61e73] font-bold">{role}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-2 mb-3">
          <button className="flex items-center justify-between w-full rounded-[8px] bg-[#1a2336]/30 border border-[#263550]/30 hover:border-[#263550] px-2.5 py-1.5 text-[12px] text-slate-400 hover:text-white hover:bg-[#1a2336]/50 transition-all">
            <div className="flex items-center gap-2">
              <SearchIcon size={13} className="text-slate-400" />
              <span>Search</span>
            </div>
            <kbd className="text-[9px] font-mono bg-[#161d2a] px-1 py-0.5 rounded border border-[#2b374d] text-slate-400">⌘K</kbd>
          </button>
        </div>

        {/* Main Nav Items */}
        <nav className="flex flex-col gap-0.5 px-2 flex-1 overflow-y-auto scrollbar-thin">
          
          {/* Dashboard (At the very top) */}
          <Link
            href={prefixPath("/admin")}
            prefetch={true}
            className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
              isActive("/admin", true)
                ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard size={15} className="text-slate-400" />
            <span>Dashboard</span>
          </Link>

          {showLink("/admin/seo") && (
            <Link
              href={prefixPath("/admin/seo")}
              prefetch={true}
              className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                isActive("/admin/seo")
                  ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                  : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
              }`}
            >
              <Globe size={15} className="text-slate-400" />
              <span>Pages</span>
            </Link>
          )}

          {showLink("/admin/sitemap") && (
            <Link
              href={prefixPath("/admin/sitemap")}
              prefetch={true}
              className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                isActive("/admin/sitemap")
                  ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                  : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
              }`}
            >
              <Map size={15} className="text-slate-400" />
              <span>Sitemap</span>
            </Link>
          )}

          {showLink("/admin/services") && (
            <Link
              href={prefixPath("/admin/services")}
              prefetch={true}
              className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                isActive("/admin/services")
                  ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                  : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
              }`}
            >
              <Briefcase size={15} className="text-slate-400" />
              <span>Services</span>
            </Link>
          )}

          {showLink("/admin/case-studies") && (
            <Link
              href={prefixPath("/admin/case-studies")}
              prefetch={true}
              className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                isActive("/admin/case-studies")
                  ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                  : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
              }`}
            >
              <BookOpen size={15} className="text-slate-400" />
              <span>Case Studies</span>
            </Link>
          )}

          {showLink("/admin/customers") && (
            <Link
              href={prefixPath("/admin/customers")}
              prefetch={true}
              className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                isActive("/admin/customers")
                  ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                  : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
              }`}
            >
              <Users size={15} className="text-slate-400" />
              <span>Users</span>
            </Link>
          )}

          {/* Dotted Divider & Extensions Section */}
          {(showLink("/admin/blog") || metaObjectsItems.length > 0) && (
            <>
              <div className="border-t border-dotted border-[#202c44] my-3" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500">
                  <span>Extensions</span>
                  <button 
                    onClick={() => setExtensionsOpen(!extensionsOpen)}
                    className="text-slate-600 hover:text-white transition-colors"
                  >
                    {extensionsOpen ? <Minus size={11} /> : <Plus size={11} />}
                  </button>
                </div>

                {extensionsOpen && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {/* Meta Objects Dropdown */}
                    {metaObjectsItems.length > 0 && (
                      <div>
                        <button
                          onClick={() => setMetaObjectsOpen(!metaObjectsOpen)}
                          className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-[13px] font-medium text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200 transition-all`}
                        >
                          <div className="flex items-center gap-3">
                            <Globe size={15} className="text-slate-400" />
                            <span>Meta Objects</span>
                          </div>
                          {metaObjectsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </button>

                        {metaObjectsOpen && (
                          <div className="mt-0.5 ml-4 pl-3.5 border-l border-[#202d45] flex flex-col gap-0.5">
                            {metaObjectsItems.map((item) => {
                              const active = isActive(item.href)
                              return (
                                <Link
                                  key={item.href}
                                  href={prefixPath(item.href)}
                                  prefetch={true}
                                  className={`rounded-[6px] px-2 py-1.5 text-[12.5px] font-medium transition-all ${
                                    active
                                      ? "text-white font-semibold"
                                      : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Blog */}
                    {showLink("/admin/blog") && (
                      <Link
                        href={prefixPath("/admin/blog")}
                        prefetch={true}
                        className={`flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-all ${
                          isActive("/admin/blog")
                            ? "bg-[#1c273d] text-white border border-[#2b3b5c]/50"
                            : "text-slate-400 hover:bg-[#1a2336]/30 hover:text-slate-200"
                        }`}
                      >
                        <FileText size={15} className="text-slate-400" />
                        <span>Blog</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#1e2638] pt-3 px-2 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-[8px] px-2.5 py-2 text-[12.5px] font-medium text-slate-400 hover:bg-[#1a2336]/30 hover:text-white transition-all"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span>View Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[8px] px-2.5 py-2 text-[12.5px] font-medium text-slate-400 hover:bg-[#1a2336]/30 hover:text-white transition-all"
          >
            <LogOut size={14} className="text-slate-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Page Content ── */}
      <main className="ml-[230px] flex-1 min-h-screen p-8 lg:p-10 bg-[#090d16] overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
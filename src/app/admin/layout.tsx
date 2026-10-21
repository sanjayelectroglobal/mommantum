"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
// Phase 3: Removed store-only icons (ShoppingCart, Tag, Box, Ticket, Coins).
import { 
  Search as SearchIcon, 
  Globe, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Minus,
  Plus,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Box
} from "lucide-react"
import { rolesConfig, isPathAllowed } from "@lib/config/roles"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string | null>("admin")
  const [email, setEmail] = useState<string | null>(null)
  const [adminPath, setAdminPath] = useState<string>("admin")
  const [loading, setLoading] = useState(false)

  // Sidebar collapsed state: default to true (icon-only mode)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Expand/collapse states for sections
  const [extensionsOpen, setExtensionsOpen] = useState(true)
  const [metaObjectsOpen, setMetaObjectsOpen] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed")
    if (saved !== null) {
      setIsCollapsed(saved === "true")
    }

    const savedRole = localStorage.getItem("admin_role")
    const savedEmail = localStorage.getItem("admin_email")
    const savedPath = localStorage.getItem("admin_path")
    if (savedRole) setRole(savedRole)
    if (savedEmail) setEmail(savedEmail)
    if (savedPath) setAdminPath(savedPath)

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          const pathSegments = window.location.pathname.split("/").filter(Boolean)
          const currentRoot = pathSegments[0] || "admin"
          localStorage.removeItem("admin_role")
          localStorage.removeItem("admin_email")
          router.push(`/${currentRoot}`)
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setRole(data.role)
          setEmail(data.email)
          if (data.role) localStorage.setItem("admin_role", data.role)
          if (data.email) localStorage.setItem("admin_email", data.email)
          if (data.customAdminPath) {
            setAdminPath(data.customAdminPath)
            localStorage.setItem("admin_path", data.customAdminPath)
          }
        }
      })
      .catch(() => {})
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("admin_sidebar_collapsed", String(next))
      return next
    })
  }

  const expandSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
      localStorage.setItem("admin_sidebar_collapsed", "false")
    }
  }

  async function handleLogout() {
    localStorage.removeItem("admin_role")
    localStorage.removeItem("admin_email")
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

  // Phase 3: Removed Collections and Categories from metaObjectsItems — those admin pages are deleted.
  const metaObjectsItems = [
    { label: "User Management", href: "/admin/users" },
  ].filter((item) => showLink(item.href))

  return (
    <div className="flex min-h-screen bg-[#090d16] text-[#e2e8f0]">

      {/* ── Collapsible Sidebar / Slider ── */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-[#0d131f] border-r border-[#1a2336] py-3.5 select-none transition-all duration-300 ease-in-out shadow-2xl ${
          isCollapsed ? "w-[70px] px-2.5" : "w-[260px] px-3.5"
        }`}
      >
        {/* Floating In/Out Edge Button (Signature slider tab) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-[#182337] border border-[#2b3d5d] text-slate-300 hover:text-white hover:bg-[#e61e73] hover:border-[#e61e73] shadow-md transition-all group"
          title={isCollapsed ? "Slide Out (Expand sidebar)" : "Slide In (Collapse sidebar)"}
        >
          {isCollapsed ? (
            <ChevronRight size={13} className="transition-transform group-hover:scale-110" />
          ) : (
            <ChevronLeft size={13} className="transition-transform group-hover:scale-110" />
          )}
        </button>

        {/* Brand Header & In/Out Toggle */}
        <div className={`flex items-center mb-3 shrink-0 ${isCollapsed ? "justify-center" : "justify-between px-1"}`}>
          <div
            onClick={expandSidebar}
            className={`flex items-center gap-2.5 cursor-pointer ${isCollapsed ? "mx-auto" : ""}`}
            title={isCollapsed ? "Click to expand sidebar" : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e61e73] to-[#b81258] shadow-md shadow-[#e61e73]/25 hover:scale-105 transition-transform">
              <span className="text-[14px] font-black text-white tracking-wider">M</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13.5px] font-bold text-white tracking-wide truncate">
                  Mommantum
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Admin Panel
                </span>
              </div>
            )}
          </div>

          {/* In/Out Header Toggle Button (Expanded mode) */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182337] transition-colors"
              title="Slide In (Collapse sidebar)"
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {/* In/Out Icon Toggle (Collapsed mode) */}
        {isCollapsed && (
          <div className="flex justify-center mb-2 shrink-0">
            <button
              type="button"
              onClick={toggleSidebar}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#141d2e] border border-[#22314a] text-slate-400 hover:text-white hover:bg-[#1d2b44] hover:border-[#2f4263] transition-all"
              title="Slide Out (Expand sidebar)"
            >
              <PanelLeftOpen size={14} />
              <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
                Slide Out
              </div>
            </button>
          </div>
        )}

        {/* User Info (Subtle) - Expanded only */}
        {email && !isCollapsed && (
          <div className="mx-1 mb-3.5 px-3 py-2 rounded-xl bg-[#131b2c] border border-[#1e2c45] text-[11px] text-slate-400 flex items-center justify-between shrink-0">
            <div className="truncate pr-2">
              <p className="truncate font-semibold text-slate-200" title={email}>{email.split("@")[0]}</p>
              <p className="text-[9.5px] uppercase tracking-wider text-[#e61e73] font-bold">{role}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className={`mb-3 shrink-0 ${isCollapsed ? "flex justify-center px-0" : "px-0.5"}`}>
          {isCollapsed ? (
            <button
              type="button"
              onClick={expandSidebar}
              className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#141d2e] border border-[#22314a] hover:border-[#2f4263] text-slate-400 hover:text-white hover:bg-[#1d2b44] transition-all"
              title="Search (⌘K)"
            >
              <SearchIcon size={14} />
              <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
                Search (⌘K)
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="flex items-center justify-between w-full rounded-xl bg-[#131b2c] border border-[#1e2c45] hover:border-[#2b3d5e] px-3 py-2 text-[12px] text-slate-400 hover:text-white hover:bg-[#182337] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <SearchIcon size={14} className="text-slate-400" />
                <span className="text-[12.5px]">Search</span>
              </div>
              <kbd className="text-[10px] font-mono bg-[#0c121e] px-1.5 py-0.5 rounded border border-[#202e48] text-slate-400">⌘K</kbd>
            </button>
          )}
        </div>

        {/* Main Nav Items (Clean, No-Scrollbar) */}
        <nav className="flex flex-col gap-1 px-0 flex-1 overflow-y-auto no-scrollbar">
          {/* Dashboard */}
          <SidebarLink
            href={prefixPath("/admin")}
            label="Dashboard"
            icon={<LayoutDashboard size={17} />}
            active={isActive("/admin", true)}
            isCollapsed={isCollapsed}
          />

          {/* Pages */}
          {(showLink("/admin/seo") || showLink("/admin/pages")) && (
            <SidebarLink
              href={prefixPath("/admin/pages")}
              label="Pages"
              icon={<Globe size={17} />}
              active={isActive("/admin/pages") || isActive("/admin/seo")}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Sitemap */}
          {showLink("/admin/sitemap") && (
            <SidebarLink
              href={prefixPath("/admin/sitemap")}
              label="Sitemap"
              icon={<Map size={17} />}
              active={isActive("/admin/sitemap")}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Services */}
          {showLink("/admin/services") && (
            <SidebarLink
              href={prefixPath("/admin/services")}
              label="Services"
              icon={<Briefcase size={17} />}
              active={isActive("/admin/services")}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Case Studies */}
          {showLink("/admin/case-studies") && (
            <SidebarLink
              href={prefixPath("/admin/case-studies")}
              label="Case Studies"
              icon={<BookOpen size={17} />}
              active={isActive("/admin/case-studies")}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Phase 3: Removed /admin/customers (store customer management page deleted) */}

          {/* Extensions & Meta Objects Section */}
          {(showLink("/admin/blog") || metaObjectsItems.length > 0) && (
            <>
              <div className="border-t border-[#1a2336] my-2 mx-1" />
              {isCollapsed ? (
                // Collapsed Icons
                <div className="flex flex-col gap-1">
                  {metaObjectsItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        expandSidebar()
                        setExtensionsOpen(true)
                        setMetaObjectsOpen(true)
                      }}
                      className="group relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl text-slate-400 hover:bg-[#182337] hover:text-white transition-all my-0.5"
                      title="Meta Objects"
                    >
                      <Box size={17} />
                      <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
                        Meta Objects
                      </div>
                    </button>
                  )}
                  {showLink("/admin/blog") && (
                    <SidebarLink
                      href={prefixPath("/admin/blog")}
                      label="Blog"
                      icon={<FileText size={17} />}
                      active={isActive("/admin/blog")}
                      isCollapsed={isCollapsed}
                    />
                  )}
                </div>
              ) : (
                // Expanded Section
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-500">
                    <span>Extensions</span>
                    <button 
                      onClick={() => setExtensionsOpen(!extensionsOpen)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Toggle section"
                    >
                      {extensionsOpen ? <Minus size={11} /> : <Plus size={11} />}
                    </button>
                  </div>

                  {extensionsOpen && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {metaObjectsItems.length > 0 && (
                        <div>
                          <button
                            onClick={() => setMetaObjectsOpen(!metaObjectsOpen)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium text-slate-400 hover:bg-[#182337] hover:text-slate-200 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Box size={16} className="text-slate-400" />
                              <span>Meta Objects</span>
                            </div>
                            {metaObjectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>

                          {metaObjectsOpen && (
                            <div className="mt-0.5 ml-4 pl-3 border-l border-[#1f2d47] flex flex-col gap-0.5">
                              {metaObjectsItems.map((item) => {
                                const active = isActive(item.href)
                                return (
                                  <Link
                                    key={item.href}
                                    href={prefixPath(item.href)}
                                    className={`rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-all ${
                                      active
                                        ? "text-[#e61e73] bg-[#e61e73]/10 font-semibold"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-[#182337]/50"
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

                      {showLink("/admin/blog") && (
                        <SidebarLink
                          href={prefixPath("/admin/blog")}
                          label="Blog"
                          icon={<FileText size={16} />}
                          active={isActive("/admin/blog")}
                          isCollapsed={false}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#1a2336] pt-3 px-0.5 space-y-1 shrink-0">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/"
                target="_blank"
                className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-[#182337] hover:text-white transition-all"
                title="View Storefront"
              >
                <ExternalLink size={16} />
                <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
                  View Storefront
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-[#182337] hover:text-[#ff5555] transition-all"
                title="Logout"
              >
                <LogOut size={16} />
                <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-[#ff5555] shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
                  Logout
                </div>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium text-slate-400 hover:bg-[#182337] hover:text-white transition-all"
              >
                <ExternalLink size={15} className="text-slate-500" />
                <span>View Storefront</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium text-slate-400 hover:bg-[#182337] hover:text-[#ff5555] transition-all"
              >
                <LogOut size={15} className="text-slate-500" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ── Page Content ── */}
      <main
        className={`flex-1 min-h-screen p-8 lg:p-10 bg-[#090d16] overflow-x-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-[70px]" : "ml-[260px]"
        }`}
      >
        {children}
      </main>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
  isCollapsed: boolean
  onClick?: () => void
}

function SidebarLink({ href, label, icon, active, isCollapsed }: SidebarLinkProps) {
  if (isCollapsed) {
    return (
      <Link
        href={href}
        prefetch={true}
        className={`group relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all my-0.5 ${
          active
            ? "bg-[#e61e73]/15 text-[#e61e73] border border-[#e61e73]/40 shadow-[0_0_15px_rgba(230,30,115,0.25)]"
            : "text-slate-400 hover:bg-[#182337] hover:text-white"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#e61e73] shadow-[0_0_8px_#e61e73]" />
        )}
        <span className={active ? "text-[#e61e73]" : "text-slate-400 group-hover:text-white transition-colors"}>
          {icon}
        </span>
        <div className="pointer-events-none absolute left-[56px] z-[70] hidden items-center rounded-md bg-[#0a0f19] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xl border border-[#23334d] group-hover:flex whitespace-nowrap">
          {label}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      prefetch={true}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all my-0.5 ${
        active
          ? "bg-[#182337] text-white border border-[#263753] shadow-sm font-semibold"
          : "text-slate-400 hover:bg-[#141c2c] hover:text-slate-200"
      }`}
    >
      <span className={active ? "text-[#e61e73]" : "text-slate-400"}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  )
}
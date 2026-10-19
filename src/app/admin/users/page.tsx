"use client"
import { useEffect, useState, useMemo } from "react"
import { Edit, Trash2, X, Shield, Key, AlertTriangle, CheckCircle, UserPlus, Search } from "lucide-react"
import { AdminSearchBar } from "../_components/AdminSearchBar"
import { getAdminCache, setAdminCache } from "../_lib/admin-cache"

interface Profile {
  id: string
  email: string
  role: string
  status: string
}

const OWNER_EMAIL = "admin@mommantum.com"

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users
    const q = searchQuery.toLowerCase().trim()
    return users.filter((u) => {
      return (
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q) ||
        (u.status || "").toLowerCase().includes(q)
      )
    })
  }, [users, searchQuery])

  // Logged-in user state
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)

  // Create Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("seo")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  // Delete Modal State
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const cached = getAdminCache<Profile[]>("admin_user_profiles")
    if (cached && cached.length > 0) {
      setUsers(cached)
      setLoading(false)
    }
    fetchUsers()
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.role) {
          setCurrentUserRole(data.role)
          setCurrentUserEmail(data.email)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  function fetchUsers() {
    setLoading(true)
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users")
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setUsers(list)
        setAdminCache("admin_user_profiles", list)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim() || !role) {
      setFormError("All fields are required")
      return
    }

    setFormLoading(true)
    setFormError("")
    setFormSuccess("")

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()

      if (res.ok) {
        setFormSuccess("User created successfully!")
        setEmail("")
        setPassword("")
        setRole("seo")
        fetchUsers() // Refresh list
      } else {
        setFormError(data.error || "Failed to create user")
      }
    } catch {
      setFormError("Server error. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!editingUser) return

    if (!editEmail.trim() || !editRole) {
      setEditError("Email and Role are required")
      return
    }

    setEditLoading(true)
    setEditError("")
    setEditSuccess("")

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editEmail,
          role: editRole,
          status: editStatus,
          password: editPassword.trim() ? editPassword : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setEditSuccess("User updated successfully!")
        setTimeout(() => {
          setEditingUser(null)
          setEditPassword("")
          fetchUsers()
        }, 1000)
      } else {
        setEditError(data.error || "Failed to update user")
      }
    } catch {
      setEditError("Server error. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  async function handleDeleteUser() {
    if (!deletingUser) return

    setDeleteLoading(true)
    setDeleteError("")

    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        setDeletingUser(null)
        fetchUsers()
      } else {
        setDeleteError(data.error || "Failed to delete user")
      }
    } catch {
      setDeleteError("Server error. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleSetStatus(user: Profile, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          role: user.role,
          status: newStatus,
        }),
      })
      if (res.ok) {
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update user status")
      }
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Server error. Please try again.")
    }
  }

  function openEditModal(user: Profile) {
    setEditingUser(user)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditStatus(user.status || "approved")
    setEditPassword("")
    setEditError("")
    setEditSuccess("")
  }

  function openDeleteModal(user: Profile) {
    setDeletingUser(user)
    setDeleteError("")
    setDeleteLoading(false)
  }

  const inputClass =
    "w-full rounded-[12px] border border-[#1f2937] bg-[#111827] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#374151]"
  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]"

  return (
    <div className="max-w-[1200px] text-slate-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            User Management
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {users.length} accounts total • Create, update, and manage administrative user accounts and access roles.
          </p>
        </div>
        <div className="shrink-0">
          <AdminSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search accounts..."
          />
        </div>
      </div>

      {/* Pending Requests Section */}
      {users.filter(u => u.status === "pending").length > 0 && (
        <div className="mt-6 rounded-[18px] border border-amber-500/20 bg-amber-500/5 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-[16px] font-extrabold text-white">
              Pending Access Requests ({users.filter(u => u.status === "pending").length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.filter(u => u.status === "pending").map((u) => (
              <div 
                key={u.id} 
                className="flex flex-col justify-between rounded-[14px] border border-[#1f2937] bg-[#111827] p-4 transition-all hover:border-amber-500/30"
              >
                <div>
                  <p className="text-[13.5px] font-bold text-white truncate" title={u.email}>
                    {u.email}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide font-medium">
                    Requested Role: <span className="text-amber-400 capitalize">{u.role}</span>
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleSetStatus(u, "approved")}
                    className="flex-1 h-[36px] rounded-[8px] bg-emerald-600 hover:bg-emerald-700 text-[12px] font-bold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>✓</span> Approve
                  </button>
                  <button
                    onClick={() => handleSetStatus(u, "rejected")}
                    className="flex-1 h-[36px] rounded-[8px] bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/25 text-[12px] font-bold text-rose-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>✗</span> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Side: Create User Form / Restrictions Block */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] h-fit">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={18} className="text-[#e61e73]" />
            <h2 className="text-[16px] font-extrabold text-white">
              Add New User
            </h2>
          </div>
          
          {currentUserRole === "admin" ? (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="manager">Manager (Edit Content)</option>
                  <option value="seo">SEO (Edit Blogs & SEO)</option>
                </select>
              </div>

              {formError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[12.5px] text-red-400 flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-[12.5px] text-green-400 flex items-start gap-2">
                  <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="h-[44px] w-full rounded-[10px] bg-[#e61e73] text-[13px] font-bold text-white transition-all hover:bg-[#ca155f] disabled:opacity-50 flex items-center justify-center"
              >
                {formLoading ? "Creating..." : "Create User"}
              </button>
            </form>
          ) : (
            <div className="rounded-[12px] bg-[#182030]/30 border border-[#232d42]/50 p-4 text-slate-400 text-[13px] leading-relaxed">
              <p className="font-bold text-slate-200 mb-1 flex items-center gap-1">
                <span>🔒</span> Access Restricted
              </p>
              Only administrators can create user credentials and manage roles.
            </div>
          )}
        </div>

        {/* Right Side: Users List */}
        <div className="rounded-[18px] bg-[#111827] p-6 border border-[#1f2937] lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-slate-400" />
              <h2 className="text-[16px] font-extrabold text-white">
                System Accounts
              </h2>
            </div>
            {!loading && users.length > 0 && (
              <div className="relative min-w-[200px] sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search accounts..."
                  className="w-full rounded-[10px] border border-[#1f2937] bg-[#0c121e] pl-8 pr-7 py-1.5 text-[12px] text-white placeholder-slate-500 focus:border-[#e61e73] focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[11px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading accounts...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No accounts found.</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No accounts matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-[12px] text-[#e61e73] hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Access Role</th>
                    <th className="pb-3">Access Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {filteredUsers.map((u) => {
                    const isOwner = u.email === OWNER_EMAIL
                    const isCurrentUser = u.email === currentUserEmail
                    const canEdit = currentUserEmail === OWNER_EMAIL || !isOwner
                    const canDelete = !isOwner && !isCurrentUser

                    return (
                      <tr key={u.id} className="text-white hover:bg-[#1f2937]/10 transition-colors">
                        <td className="py-3.5 font-medium">
                          <div className="flex items-center gap-2.5">
                            <span className="truncate">{u.email}</span>
                            {isOwner && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-400 border border-amber-500/20">
                                Owner
                              </span>
                            )}
                            {isCurrentUser && (
                              <span className="rounded-full bg-[#e61e73]/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#e61e73] border border-[#e61e73]/20">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                              u.role === "admin"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : u.role === "manager"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-bold capitalize ${
                              u.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : u.status === "rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {u.status || "approved"}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              disabled={!canEdit}
                              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-bold transition-all ${
                                canEdit
                                  ? "bg-[#1f2937] border border-[#374151] text-slate-300 hover:text-white hover:bg-[#374151]"
                                  : "opacity-40 cursor-not-allowed text-slate-500"
                              }`}
                              title={!canEdit ? "Only the owner can modify this account" : "Edit user details"}
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => openDeleteModal(u)}
                              disabled={!canDelete}
                              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-bold transition-all ${
                                canDelete
                                  ? "bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/25 hover:text-white"
                                  : "opacity-40 cursor-not-allowed text-slate-500"
                              }`}
                              title={
                                isOwner
                                  ? "The owner account cannot be deleted"
                                  : isCurrentUser
                                  ? "You cannot delete your own logged-in account"
                                  : "Delete user account"
                              }
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />
          
          <div className="relative w-full max-w-[450px] overflow-hidden rounded-[20px] border border-[#1f2937] bg-[#0f1420] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:bg-[#1a2336] hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Edit size={18} className="text-[#e61e73]" />
              <h3 className="text-[17px] font-extrabold text-white">
                Edit System Account
              </h3>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={inputClass}
                  disabled={editingUser.email === OWNER_EMAIL}
                  required
                />
                {editingUser.email === OWNER_EMAIL && (
                  <p className="mt-1 text-[11px] text-amber-500">
                    The owner's email address is fixed and cannot be changed.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Access Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className={inputClass}
                  disabled={editingUser.email === OWNER_EMAIL}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="manager">Manager (Edit Content)</option>
                  <option value="seo">SEO (Edit Blogs & SEO)</option>
                </select>
                {editingUser.email === OWNER_EMAIL && (
                  <p className="mt-1 text-[11px] text-amber-500">
                    The owner's role is fixed as Admin.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Access Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={inputClass}
                  disabled={editingUser.email === OWNER_EMAIL || editingUser.email === currentUserEmail}
                >
                  <option value="approved">Approved (Allowed Access)</option>
                  <option value="pending">Pending Review (Blocked Access)</option>
                  <option value="rejected">Rejected (Blocked Access)</option>
                </select>
                {editingUser.email === OWNER_EMAIL && (
                  <p className="mt-1 text-[11px] text-amber-500">
                    The owner's status is fixed as Approved.
                  </p>
                )}
                {editingUser.email === currentUserEmail && editingUser.email !== OWNER_EMAIL && (
                  <p className="mt-1 text-[11px] text-[#e61e73]">
                    You cannot change your own status.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#e2e8f0]">
                    New Password
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Optional</span>
                </div>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave empty to keep unchanged"
                  className={inputClass}
                />
              </div>

              {editError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[12.5px] text-red-400 flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-[12.5px] text-green-400 flex items-start gap-2">
                  <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="h-[40px] px-4 rounded-[10px] bg-[#1a2336] hover:bg-[#25324d] text-[13px] font-bold text-slate-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="h-[40px] px-5 rounded-[10px] bg-[#e61e73] hover:bg-[#ca155f] text-[13px] font-bold text-white transition-all disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          />
          
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] border border-red-500/20 bg-[#0f1420] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setDeletingUser(null)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:bg-[#1a2336] hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-3 text-red-400">
              <AlertTriangle size={20} />
              <h3 className="text-[17px] font-extrabold text-white">
                Delete Account
              </h3>
            </div>

            <p className="text-[13.5px] leading-relaxed text-slate-400">
              Are you sure you want to permanently delete administrative access for <strong className="text-white">{deletingUser.email}</strong>?
              <br />
              <span className="mt-2 block text-[12px] text-red-400/80 font-medium bg-red-500/5 border border-red-500/10 rounded-md p-2">
                This action is permanent, revokes all backend dashboard access, and cannot be undone.
              </span>
            </p>

            {deleteError && (
              <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[12.5px] text-red-400 flex items-start gap-2">
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5 pt-1">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="h-[40px] px-4 rounded-[10px] bg-[#1a2336] hover:bg-[#25324d] text-[13px] font-bold text-slate-300 hover:text-white transition-all"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="h-[40px] px-5 rounded-[10px] bg-red-600 hover:bg-red-700 text-[13px] font-bold text-white transition-all disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

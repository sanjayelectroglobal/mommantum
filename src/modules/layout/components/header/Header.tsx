import NavBar from "./NavBar"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <NavBar />
    </header>
  )
}
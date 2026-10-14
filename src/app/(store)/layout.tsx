import Header from "@modules/layout/components/header/Header"
import Footer from "@modules/layout/templates/footer"

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
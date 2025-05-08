export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-sm text-[#A67B5B]">© 2023 Product Showcase. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <a href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37] transition-colors">
            Terms
          </a>
          <a href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37] transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37] transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

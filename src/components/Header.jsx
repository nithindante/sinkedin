import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-dark-secondary border-b border-dark-border px-0 py-3 sticky top-0 z-50">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-6">
        <Link
          href="/feed"
          className="text-[1.8rem] font-bold text-light no-underline"
        >
          S<strike className="text-accent no-underline">in</strike>kedIn
        </Link>

        {/* Profile Icon */}
        <Link href="/profile" className="w-[50px] h-[50px] relative">
          <Image
            src="/default_avatar.jpg"
            alt="Profile Icon"
            fill
            className="rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  )
}

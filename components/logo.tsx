import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative h-8 w-8">
        <div className="absolute bottom-0 h-2 w-8 bg-brand-teal rounded-sm"></div>
        <div className="absolute bottom-2 h-2 w-8 bg-brand-purple rounded-sm"></div>
        <div className="absolute bottom-4 h-2 w-8 bg-brand-blue rounded-sm"></div>
      </div>
      <span className="font-bold text-xl">cToken</span>
    </Link>
  )
}

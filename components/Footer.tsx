import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-sand/60 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-display text-xl font-semibold text-charcoal mb-1">
              Junto United
            </p>
            <p className="text-sm text-charcoal/50">
              Curiosity. Intelligence. Ambition.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-charcoal/60">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-charcoal transition-colors">
              Projects
            </Link>
            <Link href="/conversation" className="hover:text-charcoal transition-colors">
              Conversation
            </Link>
            <Link href="/influencers" className="hover:text-charcoal transition-colors">
              Influencers
            </Link>
            <Link href="/contact" className="hover:text-charcoal transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sand/40">
          <p className="text-xs text-charcoal/30">
            &copy; {new Date().getFullYear()} Junto United. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

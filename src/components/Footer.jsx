import { InstagramIcon, TikTokIcon, FacebookIcon, MapPinIcon, WhatsAppIcon } from './SocialIcons'

const socialLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/923286420747', Icon: WhatsAppIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/mher_resin_studio/', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mehrresinstudio', Icon: TikTokIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1CtrodoNoK/', Icon: FacebookIcon },
  { label: 'Find us on Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=Mher+Resin+Studio+Chishtian', Icon: MapPinIcon },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-paper/80 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="Mher Resin Studio logo" className="w-10 h-10 rounded-full object-cover" />
            <p className="font-display text-lg text-paper">Mher Resin Studio</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed max-w-xs">
            Custom resin pieces, hand-poured to order. Every drop is one of a kind — so is every order.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-full bg-paper/10 flex items-center justify-center hover:bg-sky hover:text-navy transition-colors">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-sky-light mb-3">Quick links</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-paper">Home</a></li>
            <li><a href="/products" className="hover:text-paper">Products</a></li>
            <li><a href="/contact" className="hover:text-paper">Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-sky-light mb-3">Get in touch</p>
          <ul className="space-y-2 text-sm">
            <li>Phone: 0328 6420747</li>
            <li>Email: <a href="mailto:Aqsahanif165@gmail.com" className="hover:text-paper">Aqsahanif165@gmail.com</a></li>
            <li>Chishtian · Burewala · Vehari · Faisalabad</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} Mher Resin Studio. All rights reserved.
      </div>
    </footer>
  )
}

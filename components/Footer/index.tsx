import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { SiteConfig, SocialLink } from "@/data/config"

export type FooterProps = SiteConfig["footer"]

const socialIcon = (s: SocialLink) => {
  if (s.platform === "facebook") {
    return <Facebook className="w-4 h-4" />
  }
  return <Instagram className="w-4 h-4" />
}

export function Footer({
  sectionId,
  brandAriaLabel,
  brandTagline,
  contactCta,
  quickLinksTitle,
  quickLinks,
  faqTitle,
  faqs,
  copyright,
  policyLinks,
  social,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const copyrightText = copyright.replace("{year}", String(currentYear))

  return (
    <footer id={sectionId} className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center mb-4 block relative w-full max-w-[240px] md:max-w-[280px] aspect-[18/10]"
              aria-label={brandAriaLabel}
            >
              <svg
                viewBox="60 450 1060 120"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full object-contain"
                aria-hidden
              >
                <g
                  transform="translate(0,1120) scale(0.1,-0.1)"
                  fill="#12223b"
                  stroke="none"
                  style={{ filter: "invert()" }}
                >
                  <path d="M1548 6575 c-381 -72 -664 -377 -708 -762 -43 -381 173 -746 530 -895 128 -54 178 -63 335 -62 151 0 205 10 332 63 214 88 406 291 482 509 74 215 64 451 -27 647 -113 241 -317 413 -574 485 -98 27 -268 34 -370 15z m370 -114 c79 -23 195 -81 239 -119 16 -13 43 -36 61 -49 80 -63 174 -208 217 -338 39 -117 46 -296 16 -415 -69 -272 -264 -478 -531 -562 -64 -20 -96 -23 -220 -23 -124 0 -156 3 -220 23 -502 157 -710 745 -417 1176 107 159 284 277 478 321 90 21 281 13 377 -14z" />
                  <path d="M2942 5723 l3 -868 48 -3 47 -3 0 410 0 411 493 0 c541 0 573 3 672 60 79 45 151 123 193 210 36 73 37 78 37 185 0 91 -4 120 -23 167 -49 121 -148 220 -272 271 -54 22 -61 22 -628 25 l-572 3 2 -868z m1190 735 c70 -33 145 -106 178 -173 22 -43 25 -64 25 -155 0 -91 -3 -112 -25 -155 -31 -64 -111 -144 -175 -175 l-50 -25 -522 -3 -523 -3 0 361 0 361 518 -3 517 -3 57 -27z" />
                  <path d="M4635 6578 c-3 -7 -4 -29 -2 -48 l3 -35 347 -3 347 -2 0 -820 0 -820 50 0 50 0 0 820 0 820 350 0 350 0 0 50 0 50 -745 0 c-587 0 -747 -3 -750 -12z" />
                  <path d="M6542 5723 l3 -868 48 -3 47 -3 0 870 0 871 -50 0 -50 0 2 -867z" />
                  <path d="M8808 5720 l2 -870 33 0 c31 0 48 17 253 257 120 142 273 320 338 397 l119 139 36 -39 c20 -22 149 -172 286 -334 138 -161 255 -298 260 -304 6 -6 30 -35 53 -63 l44 -53 59 0 c32 0 59 3 59 6 0 4 -365 436 -649 767 -42 49 -76 92 -76 97 0 5 47 64 105 132 58 68 169 197 245 287 77 90 193 225 258 300 64 75 117 139 117 143 0 5 -26 8 -58 8 l-58 0 -100 -117 c-88 -105 -327 -385 -620 -728 -321 -377 -493 -577 -538 -629 -28 -32 -52 -62 -54 -67 -18 -48 -22 78 -22 766 l0 775 -47 0 -48 0 3 -870z" />
                </g>
                <g
                  transform="translate(0,1120) scale(0.1,-0.1)"
                  fill="#ac5687"
                  stroke="none"
                >
                  <path d="M7643 5911 c-115 -43 -187 -118 -220 -230 -43 -150 38 -312 192 -382 75 -34 192 -32 262 4 104 54 160 129 185 250 14 64 4 116 -35 197 -66 138 -245 213 -384 161z" />
                </g>
              </svg>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">{brandTagline}</p>

            <a
              href={contactCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-sm"
            >
              <Instagram className="w-4 h-4" />
              {contactCta.label}
            </a>
          </div>

          <div>
            <h3 className="font-medium mb-4">{quickLinksTitle}</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-medium mb-4">{faqTitle}</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-primary-foreground/10"
                >
                  <AccordionTrigger className="text-sm text-left hover:no-underline hover:text-primary-foreground/80 py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-primary-foreground/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="py-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-primary-foreground/60">
            <p>{copyrightText}</p>
            <div className="flex items-center gap-4">
              {policyLinks.map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label={s.name}
              >
                {socialIcon(s)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

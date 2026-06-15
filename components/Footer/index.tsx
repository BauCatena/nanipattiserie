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

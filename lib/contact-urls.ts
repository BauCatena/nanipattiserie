/** `phoneE164` sin +: ej. 54911xxxxxxxx (WhatsApp) */
export function buildWhatsAppUrl(phoneE164: string, text: string): string {
  const digits = phoneE164.replace(/\D/g, "")
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function buildInstagramDmUrl(instagramUser: string): string {
  const user = instagramUser.replace(/^@/, "")
  return `https://ig.me/m/${user}`
}

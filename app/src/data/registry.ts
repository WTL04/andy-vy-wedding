// Registry page links & payment handles.
//
// Replace the PLACEHOLDER values with your real handles before sharing
// the site. Item copy and the item image are also placeholders.

export interface RegistryItem {
  id: string
  title: string
  emoji: string
  image: string
  shortDescription: string
  longDescription: string
}

export type PaymentMethod = 'venmo' | 'zelle'

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'venmo', label: 'Venmo' },
  { id: 'zelle', label: 'Zelle' },
]

export const registry = {
  blurb:
    'We do not have a gift registry but for those who wish to give a more sentimental gift, we have put together a wishlist to share. Thank you everyone for making our next chapter a memorable one',
  items: [
    {
      id: 'honeymoon',
      title: 'Honeymoon',
      emoji: '❤️',
      image: '/imgs/honeymoon.JPG',
      shortDescription:
        'Your presence alone means the world to us but those who wish to gift a sentimental gift, we truly appreciate your kindness. Thank you fo…',
      longDescription:
        'Your presence alone means the world to us but those who wish to gift a sentimental gift, we truly appreciate your kindness. Thank you for helping us make unforgettable memories on our honeymoon!',
    },
  ] as RegistryItem[],

  payment: {
    venmoUsername: 'vyyninhh',
    // Zelle has no payment-link API, display only.
    zelleContact: 'vyyninhh@gmail.com',
    // Drop your bank-generated Zelle QR image in public/imgs/ and set this
    // to '/imgs/zelle-qr.png'. Leave empty to show a placeholder box.
    zelleQrSrc: '/imgs/vyyninhh_zelle.png' as string | undefined,
  },
}

export function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Opens Venmo with the recipient, amount, and giver prefilled
// (the giver types nothing else before paying).
export function venmoUrl(amount: number, from: string): string {
  const params = new URLSearchParams({
    txn: 'pay',
    recipients: registry.payment.venmoUsername,
    amount: amount.toFixed(2),
    note: `${from} - Vy & Andy Wedding Gift`,
  })
  return `https://venmo.com/?${params.toString()}`
}

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

export type PaymentMethod = 'venmo' | 'paypal' | 'zelle' | 'cash'

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'venmo', label: 'Venmo' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'zelle', label: 'Zelle' },
  { id: 'cash', label: 'Cash / Check' },
]

export const registry = {
  blurb:
    'Your presence is the present. But if you would like to bless us with a gift, check out our registry below.',
  pageUrl: '/registry.html',

  items: [
    {
      id: 'honeymoon',
      title: 'Honeymoon',
      emoji: '❤️',
      // TODO: swap for a real honeymoon photo, e.g. '/imgs/honeymoon.jpg'
      image: '/imgs/1.JPG',
      shortDescription:
        'Your presence alone means the world to us but those who wish to gift a sentimental gift, we truly appreciate your kindness. Thank you fo…',
      longDescription:
        'Your presence alone means the world to us but those who wish to gift a sentimental gift, we truly appreciate your kindness. Thank you for helping us make unforgettable memories on our honeymoon!',
    },
  ] as RegistryItem[],

  payment: {
    venmoUsername: 'YOUR-VENMO-USERNAME',
    paypalHandle: 'YOUR-PAYPAL-HANDLE',
    // Zelle has no payment-link API — display only.
    zelleContact: 'you@example.com',
    // Drop your bank-generated Zelle QR image in public/imgs/ and set this
    // to '/imgs/zelle-qr.png'. Leave empty to show a placeholder box.
    zelleQrSrc: '' as string | undefined,
    cashInstructions:
      'Please hand your gift to Vy or Andy in person, or mail it to the address on your invitation.',
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
    note: `${from} — Vy & Andy Wedding Gift`,
  })
  return `https://venmo.com/?${params.toString()}`
}

// PayPal.me accepts the amount as the last path segment.
export function paypalUrl(amount: number): string {
  return `https://paypal.me/${registry.payment.paypalHandle}/${amount.toFixed(2)}`
}

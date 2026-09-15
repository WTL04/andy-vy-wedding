import { useState } from 'react'
import { registry, type RegistryItem } from '../data/registry'
import ContributeModal from './ContributeModal'

export default function RegistryPage() {
  const [activeItem, setActiveItem] = useState<RegistryItem | null>(null)

  return (
    <div className="reg-page">
      <a className="reg-back" href="/">
        ‹ Back to our wedding site
      </a>
      <img
        className="reg-monogram"
        src="/imgs/andy_vy_logo_white_transparent.png"
        alt="A & V monogram"
      />
      <p className="reg-names">Vy &amp; Andy</p>
      <h1 className="reg-title">Our Registry</h1>

      <main className="reg-main">
        {registry.items.map((item) => (
          <article key={item.id} className="reg-card">
            <img
              className="reg-card__image"
              src={item.image}
              alt={item.title}
            />
            <div className="reg-card__body">
              <h2 className="reg-card__title">
                {item.title} <span aria-hidden="true">{item.emoji}</span>
              </h2>
              <p className="reg-card__desc">{item.shortDescription}</p>
              <button
                type="button"
                className="reg-card__contribute"
                onClick={() => setActiveItem(item)}
              >
                Contribute
              </button>
            </div>
          </article>
        ))}
      </main>

      {activeItem && (
        <ContributeModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  )
}

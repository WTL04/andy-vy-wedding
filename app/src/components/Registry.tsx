import { useState } from 'react'
import './Registry.css'
import './ContributeModal.css'
import { registry, type RegistryItem } from '../data/registry'
import ContributeModal from './ContributeModal'

export default function Registry() {
  const [activeItem, setActiveItem] = useState<RegistryItem | null>(null)

  return (
    <div id="registry" className="registry">
      <h2>Registry</h2>
      <p className="registry-blurb">{registry.blurb}</p>

      {registry.items.map((item) => (
        <article key={item.id} className="registry-card">
          <img
            className="registry-card__image"
            src={item.image}
            alt={item.title}
          />
          <div className="registry-card__body">
            <h3 className="registry-card__title">
              {item.title} <span aria-hidden="true">{item.emoji}</span>
            </h3>
            <p className="registry-card__desc">{item.shortDescription}</p>
            <button
              type="button"
              className="registry-card__contribute"
              onClick={() => setActiveItem(item)}
            >
              Contribute
            </button>
          </div>
        </article>
      ))}

      {activeItem && (
        <ContributeModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  )
}

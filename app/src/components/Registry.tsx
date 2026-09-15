import './Registry.css'
import { registry } from '../data/registry'

export default function Registry() {
  return (
    <div id="registry" className="registry">
      <h2>Registry</h2>
      <p className="registry-blurb">{registry.blurb}</p>
      <a
        className="registry-button registry-button--primary"
        href={registry.pageUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Our Registry
      </a>
    </div>
  )
}

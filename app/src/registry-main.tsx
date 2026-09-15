import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/RegistryPage.css'
import './components/ContributeModal.css'
import RegistryPage from './components/RegistryPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegistryPage />
  </StrictMode>,
)

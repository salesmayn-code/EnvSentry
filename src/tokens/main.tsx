import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { TokensPage } from './TokensPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TokensPage />
  </StrictMode>,
)

import { useState } from 'react'
import { Routes, Route, Redirect } from './router'
import { Nav } from './components/Nav'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProductsPage } from './pages/ProductsPage'
import { ContactPage } from './pages/ContactPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { translations } from './i18n/translations'
import type { Lang } from './types'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const t = translations[lang]

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Redirect to="/products" />} />
          <Route path="/products" element={<ProductsPage t={t.screen1} />} />
          <Route path="/contact/:applicationId/:productId" element={<ContactPage t={t.screen2} s1t={t.screen1} />} />
          <Route path="/applications" element={<ApplicationsPage t={t.screen3} s2t={t.screen2} />} />
          <Route path="/applications/:applicationId" element={<ApplicationsPage t={t.screen3} s2t={t.screen2} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  )
}

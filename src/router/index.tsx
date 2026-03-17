import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Params = Record<string, string>

interface RouterCtx {
  pathname: string
  navigate: (to: string, opts?: { replace?: boolean }) => void
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

const RouterContext = createContext<RouterCtx | null>(null)
const ParamsContext = createContext<Params>({})

// ─── Router ───────────────────────────────────────────────────────────────────

export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string, { replace = false } = {}) => {
    if (replace) {
      window.history.replaceState(null, '', to)
    } else {
      window.history.pushState(null, '', to)
    }
    setPathname(to)
  }, [])

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

// ─── Route matching ───────────────────────────────────────────────────────────

function matchPath(pattern: string, pathname: string): Params | null {
  // Wildcard catches everything
  if (pattern === '*') return {}

  const pp = pattern.split('/').filter(Boolean)
  const vp = pathname.split('/').filter(Boolean)
  if (pp.length !== vp.length) return null

  const params: Params = {}
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) {
      params[pp[i].slice(1)] = decodeURIComponent(vp[i])
    } else if (pp[i] !== vp[i]) {
      return null
    }
  }
  return params
}

// ─── Route ────────────────────────────────────────────────────────────────────

export function Route({ path, element }: { path: string; element: ReactNode }) {
  const ctx = useContext(RouterContext)
  if (!ctx) return null
  const params = matchPath(path, ctx.pathname)
  if (params === null) return null
  return <ParamsContext.Provider value={params}>{element}</ParamsContext.Provider>
}

// ─── Routes ───────────────────────────────────────────────────────────────────
// Like React Router's <Routes> / old <Switch>: renders only the first child
// <Route> whose path matches the current URL, so the wildcard "*" only fires
// when no specific route has matched.

export function Routes({ children }: { children: ReactNode }) {
  const ctx = useContext(RouterContext)
  if (!ctx) return null

  let matched: ReactNode = null

  Children.forEach(children, (child) => {
    if (matched) return
    if (!isValidElement(child)) return
    // We only handle our own <Route> elements here
    const { path, element } = child.props as { path: string; element: ReactNode }
    if (typeof path !== 'string' || element === undefined) return
    const params = matchPath(path, ctx.pathname)
    if (params !== null) {
      matched = (
        <ParamsContext.Provider value={params}>{element}</ParamsContext.Provider>
      )
    }
  })

  return matched
}

// ─── Redirect ─────────────────────────────────────────────────────────────────

export function Redirect({ to }: { to: string }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to, { replace: true })
  }, [navigate, to])
  return null
}

// ─── Link ─────────────────────────────────────────────────────────────────────

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  /** Replace history entry instead of pushing */
  replace?: boolean
}

/**
 * A semantic <a> tag that uses the client-side router.
 * Supports middle-click / Ctrl+click / ⌘+click to open in a new tab,
 * and falls back to a full navigation if the router is unavailable.
 */
export function Link({ to, replace = false, onClick, children, ...rest }: LinkProps) {
  const navigate = useNavigate()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modifier clicks open in new tab naturally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onClick?.(e)
    navigate(to, { replace })
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useNavigate() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useNavigate must be used inside <Router>')
  return ctx.navigate
}

export function useParams<T extends Params = Params>(): T {
  return useContext(ParamsContext) as T
}

export function usePathname(): string {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('usePathname must be used inside <Router>')
  return ctx.pathname
}

/** Keeps document.title in sync with the current page. */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — nesto` : 'nesto'
    return () => { document.title = prev }
  }, [title])
}

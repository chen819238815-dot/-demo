import { createContext, useContext, useState, ReactNode } from 'react'

export type Scope = 'retail' | 'mall' | 'all'

interface ScopeCtx {
  scope: Scope
  setScope: (s: Scope) => void
}

const Ctx = createContext<ScopeCtx>({ scope: 'all', setScope: () => {} })

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<Scope>('all')
  return <Ctx.Provider value={{ scope, setScope }}>{children}</Ctx.Provider>
}

export function useScope() {
  return useContext(Ctx)
}

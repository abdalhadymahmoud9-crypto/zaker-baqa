import React, { useState, useCallback } from 'react';
export function FileCard({ children, lang, dir }: any) { return <div lang={lang} dir={dir} style={{ minHeight: '100vh', padding: 24, overflow: 'hidden' }}>{children}</div>; }
export function FileRouter({ children }: any) { return <>{children}</>; }
export function useLocalState<T>(key: string, init: T): [T, (v: T) => void, { ready: boolean }] {
  const [v, setV] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  const set = useCallback((n: T) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {} }, [key]);
  return [v, set, { ready: true }];
}

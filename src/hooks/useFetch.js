import { useCallback, useEffect, useRef, useState } from 'react'

/** Erreur HTTP : `status` = code HTTP, `data` = corps de la réponse d'erreur. */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Message lisible, y compris pour le format d'erreur de FastAPI ({ detail: ... })
function errorMessage(data, status) {
  const d = data?.detail ?? data?.message
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((e) => e.msg ?? JSON.stringify(e)).join(', ')
  return `HTTP ${status}`
}

/** Utilisable seul, sans React : await apiFetch(url, { method: 'POST', body, token }) */
export async function apiFetch(url, { method = 'GET', headers, body, token, signal } = {}) {
  const h = new Headers(headers)
  const t = typeof token === 'function' ? token() : token
  if (t) h.set('Authorization', `Bearer ${t}`)

  const verb = method.toUpperCase()
  let payload
  if (body !== undefined && body !== null && verb !== 'GET' && verb !== 'HEAD') {
    const isPlain = Array.isArray(body) || body.constructor === Object
    payload = isPlain ? JSON.stringify(body) : body // FormData, string, Blob… passent tels quels
    if (isPlain && !h.has('Content-Type')) h.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { method: verb, headers: h, body: payload, signal })
  const type = res.headers.get('content-type') ?? ''
  const data = res.status === 204 ? null : type.includes('json') ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) throw new ApiError(errorMessage(data, res.status), res.status, data)
  return data
}

/**
 * useFetch(url, { method, headers, body, token, immediate, onSuccess, onError })
 *
 * - GET : requête automatique (et relancée si url, body ou token changent).
 * - POST / PUT / PATCH / DELETE : requête à la demande via execute().
 * - `immediate` force l'un ou l'autre comportement.
 * - `url` = null/undefined : aucune requête (utile pour les chargements conditionnels).
 * - `token` : chaîne ou fonction (ex. () => localStorage.getItem('token')) → en-tête Bearer.
 * - `headers` : objet simple.
 *
 * Retourne { data, loading, error, execute, reload, abort }.
 * execute(overrides) accepte { url, body, headers, token, method } et renvoie toujours
 * { data, error } sans jamais lever d'exception (l'erreur est aussi dans `error`).
 */
export default function useFetch(url, options = {}) {
  const method = (options.method ?? 'GET').toUpperCase()
  const auto = options.immediate ?? method === 'GET'

  const [state, setState] = useState({ data: null, loading: auto && !!url, error: null })
  // Les options sont lues via des refs : passer un objet littéral ne relance pas le fetch
  const optionsRef = useRef(options)
  const urlRef = useRef(url)
  optionsRef.current = options
  urlRef.current = url
  const controllerRef = useRef(null)

  const run = useCallback(async (overrides = {}, resetData = false) => {
    const base = optionsRef.current
    const opts = { ...base, ...overrides, headers: { ...base.headers, ...overrides.headers } }
    const target = overrides.url ?? urlRef.current
    if (!target) return { data: null, error: null }

    controllerRef.current?.abort() // annule la requête précédente
    const controller = new AbortController()
    controllerRef.current = controller

    setState((s) => ({ data: resetData ? null : s.data, loading: true, error: null }))
    try {
      const data = await apiFetch(target, { ...opts, signal: controller.signal })
      setState({ data, loading: false, error: null })
      opts.onSuccess?.(data)
      return { data, error: null }
    } catch (error) {
      if (error.name === 'AbortError') return { data: null, error: null, aborted: true }
      setState((s) => ({ ...s, data: null, loading: false, error }))
      opts.onError?.(error)
      return { data: null, error }
    }
  }, [])

  const bodyKey = typeof options.body === 'string' ? options.body : JSON.stringify(options.body ?? null)
  const tokenKey = typeof options.token === 'function' ? undefined : options.token

  useEffect(() => {
    if (!auto) return
    if (!url) {
      setState((s) => (s.data || s.loading || s.error ? { data: null, loading: false, error: null } : s))
      return
    }
    run({}, true) // changement d'URL : on repart d'un état vide
    return () => controllerRef.current?.abort()
  }, [url, method, auto, bodyKey, tokenKey, run])

  useEffect(() => () => controllerRef.current?.abort(), []) // démontage

  // `nativeEvent` : permet de passer execute directement à onClick sans polluer les options
  const execute = useCallback((overrides) => run(overrides?.nativeEvent ? {} : overrides), [run])
  const reload = useCallback(() => run(), [run])
  const abort = useCallback(() => controllerRef.current?.abort(), [])

  return { ...state, execute, reload, abort }
}
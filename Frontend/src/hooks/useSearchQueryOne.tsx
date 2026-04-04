import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { parse, stringify } from 'qs'

function useSearchQueryOne<T extends Record<string, any>>() {
  const location = useLocation()
  const navigate = useNavigate()

  const [query, setQuery] = useState<T>(() => {
    const params = parse(location.search, { ignoreQueryPrefix: true })
    return params as T
  })

  useEffect(() => {
    const params = parse(location.search, { ignoreQueryPrefix: true })
    setQuery(params as T)
  }, [location.search])

  // ✅ Overwrites the query completely
  const updateQuery = useCallback(
    (newQuery: Partial<T>) => {
      const searchParams = stringify(newQuery, {
        addQueryPrefix: true,
        arrayFormat: 'indices',
      })
      navigate({ search: searchParams }, { replace: true })
    },
    [navigate]
  )

  return { query, updateQuery } as const
}

export default useSearchQueryOne

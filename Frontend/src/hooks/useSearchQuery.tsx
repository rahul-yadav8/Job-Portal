import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {parse, stringify} from 'qs';
function useSearchQuery<T extends Record<string, any>>() {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState<T>(() => {
        const params = parse(location.search, { ignoreQueryPrefix: true })
        return params as T;
    });

    useEffect(() => {
        const params = parse(location.search, { ignoreQueryPrefix: true });
        setQuery(params as T);
    }, [location.search]);

    const updateQuery = useCallback((newQuery: Partial<T>) => {
        const params = parse(location.search, { ignoreQueryPrefix: true })
        const searchParams = stringify(
          { ...params, ...newQuery },
          { addQueryPrefix: true }
        )
        navigate({ search: searchParams.toString() }, { replace: true })
    }, [location.search, navigate]);

    return {query, updateQuery} as const;
}

export default useSearchQuery;


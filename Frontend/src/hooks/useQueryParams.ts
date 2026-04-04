import queryString from "query-string"
import { useLocation, useNavigate } from "react-router-dom"

export const useUpdateQuery = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const updateQuery = (
        params: Record<string, any>,
        options?: { replace?: boolean }
    ) => {
        const current = queryString.parse(location.search)

        const updated = { ...current, ...params }

        Object.keys(updated).forEach((key) => {
            if (!updated[key]) delete updated[key]
        })

        navigate(
            {
                pathname: location.pathname,
                search: `?${queryString.stringify(updated)}`,
            },
            { replace: options?.replace }
        )
    }

    return updateQuery
}
import { useLocation, useParams } from "react-router-dom"
import queryString from "query-string"

export const useRouteQuery = () => {
    const location = useLocation()
    const params = useParams()

    const query = queryString.parse(location.search)

    return {
        params,
        query,
    }
}
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollReset() {
    const { pathname } = useLocation()

    useEffect(() => {
        // We reset scroll to top for all pages except the product list
        if (pathname !== '/productos') {
            window.scrollTo(0, 0)
        }
    }, [pathname])

    return null
}

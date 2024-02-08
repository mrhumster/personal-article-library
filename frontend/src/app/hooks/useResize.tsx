import { useState, useEffect } from 'react'
import useDebounce from './useDebounce'

const useResize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight])

    useEffect(() => {
        const resize = useDebounce(() => {
            setSize([
                window.innerWidth,
                window.innerHeight
            ])
        })

        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    return size
}

export default useResize
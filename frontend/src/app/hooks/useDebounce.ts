const useDebounce = (func: () => void, milliseconds: number = 400) => {
    const time = milliseconds || 400
    let timer: number

    return event => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(func, time, event)
    }
}

export default useDebounce
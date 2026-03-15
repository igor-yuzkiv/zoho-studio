export function useConsoleLogger(namespace: string) {
    function log(...args: unknown[]) {
        console.log(`[${namespace}]`, ...args)
    }

    function error(msg: string, ...args: unknown[]) {
        console.error(message(msg), ...args)
    }

    function warn(msg: string, ...args: unknown[]) {
        console.warn(message(msg), ...args)
    }

    function info(msg: string, ...args: unknown[]) {
        console.info(message(msg), ...args)
    }

    function debug(msg: string, ...args: unknown[]) {
        console.debug(message(msg), ...args)
    }

    function message(msg: string) {
        return `[${namespace}] ${msg}`
    }

    return {
        log,
        error,
        warn,
        info,
        debug,
        message,
    }
}

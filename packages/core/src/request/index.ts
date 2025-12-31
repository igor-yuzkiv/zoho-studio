export type RequestOptions = {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATH'
    headers?: Record<string, string>
    data?: Record<string, unknown>
}

export type RequestResponse<T = unknown> = {
    status: number
    message?: string
    data: T
}

export class RequestError extends Error {
    constructor(public code: number, message?: string) {
        super(message)
        this.name = 'RequestError'
    }
}
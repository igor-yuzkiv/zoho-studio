import type { Error } from './result.types.ts'

export type PaginationParams = {
    page: number
    per_page: number
}

export type PagingResponseMeta = {
    page: number
    per_page: number
    total: number
    has_more: boolean
}

export type PagingResponse<T> = {
    data: T[]
    meta: PagingResponseMeta
}

export type SuccessPaginatedResult<T> = PagingResponse<T> & { ok: true }

export type PaginatedResult<T, E = string> = SuccessPaginatedResult<T> | Error<E>

export type PromisePaginatedResult<T, E = string> = Promise<PaginatedResult<T, E>>

export type Ok<T> = { ok: true; value: T }

export type Error<E> = { ok: false; error: E }

export type Result<T, E = string> = Ok<T> | Error<E>

export type Maybe<T> = T | null | undefined

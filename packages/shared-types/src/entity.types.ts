export interface IEntity extends Record<string, unknown> {
    id: string
}

export type EntityRef = {
    entityName: string
    id: string
}

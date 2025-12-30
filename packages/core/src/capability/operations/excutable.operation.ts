import type { ICapabilityAdapter } from '../capability.adapter.ts'

export interface IExecutableAdapter {
    execute(): Promise<unknown>
}

export const isExecutableAdapter = (
    adapter: ICapabilityAdapter,
): adapter is ICapabilityAdapter & IExecutableAdapter => {
    return typeof (adapter as any).execute === 'function'
}

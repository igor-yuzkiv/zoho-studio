import type { ICapabilityAdapter } from '../capability.adapter.ts'
import type { CapabilityType } from '../capability.descriptor.ts'
import type { IEntity } from '@zoho-studio/utils'

export interface IExecutableAdapter {
    execute(): Promise<unknown>
}

export const isExecutableAdapter = <TCapabilityType extends CapabilityType, TOrigin extends IEntity = IEntity>(
    adapter: ICapabilityAdapter<TCapabilityType, TOrigin>
): adapter is ICapabilityAdapter<TCapabilityType, TOrigin> & IExecutableAdapter => {
    return typeof (adapter as any).execute === 'function'
}

import type { FieldRef, ModuleRef } from './crm.modules.types.ts'
import type { IEntity } from '@zoho-studio/utils'

export interface ZohoCrmWorkflow extends IEntity {
    id: string
    name: string
    description: string | null
    module: ModuleRef
    created_time: string
    modified_time: string
    last_executed_time: string
    status: { active: boolean }
    source: string
    conditions?: WfCondition[]
    execute_when?: WfExecuteWhen
}

export type WfCondition = {
    id: string
    criteria_details: { criteria: WfCriteria | WfCriteriaGroup }
    instant_actions: { actions: WfAction[] }
}

export type WfExecuteWhen = {
    details: {
        repeat: boolean
        match_all: boolean
        trigger_module: ModuleRef
        criteria?: WfCriteria | WfCriteriaGroup
    }
    type: string
}

export type WfAction = {
    id: string
    name: string
    type: string
}

export type WfCriteriaGroup = {
    group: WfCriteria[]
    group_operator: string
}

export type WfCriteria = {
    comparator: string
    field: FieldRef
    type: string
    value: string
}

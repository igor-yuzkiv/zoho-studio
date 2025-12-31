import { ZohoCrmFunction } from '../../types'
import type { IArtifact, ServiceProviderId, FunctionType } from '@zoho-studio/core'
import { FunctionTypeMetadataMap } from '@zoho-studio/core'
import { makeArtifactId } from '@zoho-studio/core'
import { snakeCase } from 'lodash'

function normalizeCrmFunctionName(fx: ZohoCrmFunction): string {
    const possibleFields = [fx.api_name, fx.name, fx.display_name]

    for (const field of possibleFields) {
        if (typeof field === 'string' && field.trim() !== '' && field.trim().toLowerCase() !== 'null') {
            return snakeCase(field.trim())
        }
    }

    return 'unknown_function'
}

function mapFunctionCategoryToType(category?: string): FunctionType {
    if (!category) {
        return 'unknown'
    }

    return (
        Object.values(FunctionTypeMetadataMap)
            .map((i) => i.type)
            .find((i) => i === category) || 'unknown'
    )
}

export function mapCrmFunctionToArtifact(
    data: ZohoCrmFunction,
    providerId: ServiceProviderId
): IArtifact<'functions', ZohoCrmFunction> {
    return {
        id: makeArtifactId(providerId, 'functions', data.id),
        source_id: data.id,
        capability_type: 'functions',
        provider_id: providerId,
        display_name: normalizeCrmFunctionName(data),
        api_name: data?.api_name || data?.name,
        payload: {
            type: mapFunctionCategoryToType(data?.category),
            script: data?.script,
        },
        origin: data,
    }
}

export function mapManyCrmFunctionsToArtifact(
    functions: ZohoCrmFunction[],
    providerId: ServiceProviderId
): IArtifact<'functions', ZohoCrmFunction>[] {
    return functions.map((i) => mapCrmFunctionToArtifact(i, providerId))
}

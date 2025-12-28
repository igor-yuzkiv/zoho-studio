import { IntegrationsRegistryImpl } from '@zoho-studio/core'
import { ZohoCrmIntegrationManifest } from '@zoho-studio/integrations/zoho-crm'

const integrationsRegistry = new IntegrationsRegistryImpl()

integrationsRegistry.add(ZohoCrmIntegrationManifest)

export { integrationsRegistry }

import { IntegrationsRegistryImpl } from '@zoho-studio/core'
import { ZohoCrmIntegrationManifest } from '@zoho-studio/integrations/zoho-crm'
import { ZohoCreatorIntegrationManifest } from '@zoho-studio/integrations/zoho-creator'

const integrationsRegistry = new IntegrationsRegistryImpl()

integrationsRegistry.add(ZohoCrmIntegrationManifest)
integrationsRegistry.add(ZohoCreatorIntegrationManifest)

export { integrationsRegistry }

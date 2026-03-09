import { CreateGitRepositoryRequest, IGitRepository } from './types.ts'
import { apiClient } from '../api-client/api-client.ts'

export async function createGitRepository(data: CreateGitRepositoryRequest): Promise<IGitRepository> {
    return apiClient.post<IGitRepository>('git/repositories', data).then((response) => response.data)
}

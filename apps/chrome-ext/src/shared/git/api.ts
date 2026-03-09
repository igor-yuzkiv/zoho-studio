import {
    CommitGitRepositoryRequest,
    CommitGitRepositoryResponse,
    CreateGitRepositoryRequest,
    IGitRepository,
} from './types.ts'
import { apiClient } from '../api-client/api-client.ts'

export async function createGitRepository(data: CreateGitRepositoryRequest): Promise<IGitRepository> {
    return apiClient.post<IGitRepository>('git/repositories', data).then((response) => response.data)
}

export async function commitGitRepository(data: CommitGitRepositoryRequest): Promise<CommitGitRepositoryResponse> {
    const formData = new FormData()
    formData.append('file', data.zipFile, 'file.zip')
    formData.append('message', data.message)
    formData.append('repository', data.repository)
    formData.append('author[name]', data.author.name)
    formData.append('author[email]', data.author.email)

    return apiClient
        .post<CommitGitRepositoryResponse>(`git/repositories/${data.repository}/commit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => response.data)
}

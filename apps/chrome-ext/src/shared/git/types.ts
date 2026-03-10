export interface IGitGlobalConfig {
    userName: string
    userEmail: string
}

export interface IGitRepository {
    name: string
    description?: string
}

export type GitAuthorDto = {
    name: string
    email: string
}

export type CreateGitRepositoryRequest = {
    name: string
    description?: string
    author: GitAuthorDto
}

export type CommitGitRepositoryRequest = {
    repository: string
    message: string
    author: GitAuthorDto
    zipFile: Blob | File
}

export type CommitGitRepositoryResponse = {
    message: string
}

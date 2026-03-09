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

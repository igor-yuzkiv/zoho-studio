import axios from 'axios'

export const isMockApiEnabled = import.meta.env.VITE_API_MODE === 'mock'

export const mockApiClient = axios.create({
    baseURL: import.meta.env.VITE_MOCK_API_BASE_PATH,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

export async function saveMockData(fileName: string, data: Array<unknown>) {
    await mockApiClient.post(fileName, { data }).catch(console.error)
}

export async function fetchMockData<T>(fileName: string): Promise<T | null> {
    return mockApiClient
        .get<T>(fileName)
        .then((response) => response.data)
        .catch(() => null)
}

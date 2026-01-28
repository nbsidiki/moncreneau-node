import axios, { AxiosInstance } from 'axios'
import type { MoncreneauConfig, ApiErrorDetails } from './types'
import { MoncreneauError } from './types'

export class HttpClient {
    private client: AxiosInstance
    private readonly apiKey: string
    private readonly maxRetries: number

    constructor(config: MoncreneauConfig) {
        this.apiKey = config.apiKey
        this.maxRetries = config.maxRetries || 3

        this.client = axios.create({
            baseURL: config.baseUrl || 'https://mc-prd.duckdns.org/api/v1',
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
            },
        })

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                if (error.response) {
                    const errorData = error.response.data as { error: ApiErrorDetails }
                    throw new MoncreneauError(
                        errorData.error,
                        error.response.status
                    )
                }
                throw error
            }
        )
    }

    async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        const response = await this.client.get<T>(path, { params })
        return response.data
    }

    async post<T>(path: string, data?: any): Promise<T> {
        const response = await this.client.post<T>(path, data)
        return response.data
    }

    async delete(path: string): Promise<void> {
        await this.client.delete(path)
    }
}

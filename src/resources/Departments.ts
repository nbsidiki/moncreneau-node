import { HttpClient } from './http'
import type {
    Department,
    Availability,
    GetAvailabilityParams,
} from './types'

export class DepartmentsResource {
    constructor(private http: HttpClient) { }

    /**
     * List all departments
     */
    async list(): Promise<Department[]> {
        return this.http.get<Department[]>('/departments')
    }

    /**
     * Retrieve a department by ID
     */
    async retrieve(id: string): Promise<Department> {
        return this.http.get<Department>(`/departments/${id}`)
    }

    /**
     * Get availability for a department
     */
    async getAvailability(
        id: string,
        params: GetAvailabilityParams
    ): Promise<Availability> {
        return this.http.get<Availability>(`/departments/${id}/availability`, params)
    }
}

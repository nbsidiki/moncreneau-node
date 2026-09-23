import { HttpClient } from '../http'
import type {
    Department,
    SlotAvailability,
} from '../types'

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
     * Check availability for a single slot. The backend only accepts one
     * `dateTime`, not a date range.
     */
    async getAvailability(
        id: string,
        dateTime: string
    ): Promise<SlotAvailability> {
        return this.http.get<SlotAvailability>(`/departments/${id}/availability`, { dateTime })
    }
}

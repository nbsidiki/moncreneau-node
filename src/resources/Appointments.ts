import { HttpClient } from '../http'
import type {
    Appointment,
    CreateAppointmentRequest,
    AppointmentPage,
    ListAppointmentsParams,
} from '../types'

export class AppointmentsResource {
    constructor(private http: HttpClient) { }

    /**
     * Create a new appointment
     */
    async create(data: CreateAppointmentRequest): Promise<Appointment> {
        return this.http.post<Appointment>('/appointments', data)
    }

    /**
     * Retrieve an appointment by ID
     */
    async retrieve(id: string): Promise<Appointment> {
        return this.http.get<Appointment>(`/appointments/${id}`)
    }

    /**
     * List appointments with pagination and filters
     */
    async list(params?: ListAppointmentsParams): Promise<AppointmentPage> {
        return this.http.get<AppointmentPage>('/appointments', params)
    }

    /**
     * Cancel an appointment
     */
    async cancel(id: string): Promise<void> {
        await this.http.delete(`/appointments/${id}`)
    }
}

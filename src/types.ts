export interface MoncreneauConfig {
    apiKey: string
    baseUrl?: string
    timeout?: number
    maxRetries?: number
}

export interface Appointment {
    id: string
    departmentId: string
    dateTime: string
    status: 'PENDING_PAYMENT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    userName: string
    userPhone: string
    userEmail?: string
    notes?: string
    qrCode: string
    createdAt: string
    creditsConsumed: number
}

export interface CreateAppointmentRequest {
    departmentId: string
    dateTime: string
    userName: string
    userPhone: string
    userEmail?: string
    notes?: string
}

export interface AppointmentPage {
    content: Appointment[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
}

export interface ListAppointmentsParams {
    page?: number
    size?: number
    status?: string
    departmentId?: string
    startDate?: string
    endDate?: string
}

export interface Department {
    id: string
    name: string
    description?: string
    slotDuration: number
    isActive: boolean
    openingHours?: Record<string, Array<{ start: string; end: string }>>
}

export interface Availability {
    departmentId: string
    availability: Array<{
        date: string
        slots: Array<{
            time: string
            available: boolean
            dateTime: string
        }>
    }>
}

export interface GetAvailabilityParams {
    startDate: string
    endDate: string
}

export interface ApiErrorDetails {
    code: string
    message: string
    details?: Record<string, any>
}

export class MoncreneauError extends Error {
    public readonly code: string
    public readonly statusCode: number
    public readonly details?: Record<string, any>

    constructor(error: ApiErrorDetails, statusCode: number) {
        super(error.message)
        this.name = 'MoncreneauError'
        this.code = error.code
        this.statusCode = statusCode
        this.details = error.details
        Object.setPrototypeOf(this, MoncreneauError.prototype)
    }
}

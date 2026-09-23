export interface MoncreneauConfig {
    apiKey: string
    baseUrl?: string
    timeout?: number
    maxRetries?: number
}

export interface Appointment {
    id: string
    departmentId: number
    dateTime: string
    status: 'PENDING_PAYMENT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    name: string
    qrCode: string
    createdAt: string
    creditsConsumed: number
    externalUserId?: string
}

export interface CreateAppointmentRequest {
    departmentId: number
    dateTime: string
    name: string
    externalUserId?: string
    workerId?: number
}

export interface AppointmentPage {
    appointments: Appointment[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    isLast: boolean
}

export interface ListAppointmentsParams {
    page?: number
    size?: number
    status?: string
    departmentId?: string
    externalUserId?: string
    startDate?: string
    endDate?: string
}

export interface Department {
    id: number
    name: string
    description?: string
    slotDuration: number
    isActive: boolean
    openingHours?: Record<string, Array<{ start: string; end: string }>>
}

/**
 * Réponse réelle de GET /departments/{id}/availability?dateTime=... — un seul
 * créneau, pas une plage (le backend n'accepte qu'un dateTime unique).
 */
export interface SlotAvailability {
    slotTime: string
    available: boolean
    remainingSlots: number
    unavailabilityReason?: string
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

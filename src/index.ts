import { HttpClient } from './http'
import { AppointmentsResource } from './resources/Appointments'
import { DepartmentsResource } from './resources/Departments'
import type { MoncreneauConfig } from './types'
import { MoncreneauError } from './types'
import { createHmac } from 'crypto'

export class Moncreneau {
    public readonly appointments: AppointmentsResource
    public readonly departments: DepartmentsResource

    constructor(apiKey: string, config?: Partial<MoncreneauConfig>) {
        const fullConfig: MoncreneauConfig = {
            apiKey,
            ...config,
        }

        const http = new HttpClient(fullConfig)

        this.appointments = new AppointmentsResource(http)
        this.departments = new DepartmentsResource(http)
    }

    /**
     * Verify webhook signature using HMAC-SHA256
     */
    static verifyWebhookSignature(
        payload: any,
        signature: string,
        secret: string
    ): boolean {
        const payloadString = typeof payload === 'string'
            ? payload
            : JSON.stringify(payload)

        const hmac = createHmac('sha256', secret)
        hmac.update(payloadString)
        const computed = hmac.digest('hex')

        return computed === signature
    }
}

export default Moncreneau
export { MoncreneauError }
export type * from './types'

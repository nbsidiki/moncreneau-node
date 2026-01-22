const axios = require('axios');
const crypto = require('crypto');

class MoncreneauError extends Error {
    constructor(error, statusCode) {
        super(error.message || 'An error occurred');
        this.name = 'MoncreneauError';
        this.code = error.code || 'UNKNOWN_ERROR';
        this.statusCode = statusCode;
        this.details = error.details;
    }
}

class HttpClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.client = axios.create({
            baseURL: config.baseUrl || 'https://api.moncreneau.gn/v1',
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
            },
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    const errorData = error.response.data.error || {};
                    throw new MoncreneauError(errorData, error.response.status);
                }
                throw error;
            }
        );
    }

    async get(path, params) {
        const response = await this.client.get(path, { params });
        return response.data;
    }

    async post(path, data) {
        const response = await this.client.post(path, data);
        return response.data;
    }

    async delete(path) {
        await this.client.delete(path);
    }
}

class Appointments {
    constructor(http) {
        this.http = http;
    }

    /**
     * Create a new appointment
     * @param {Object} data - Appointment data
     * @returns {Promise<Object>} Created appointment
     */
    async create(data) {
        return this.http.post('/appointments', data);
    }

    /**
     * Retrieve an appointment by ID
     * @param {string} id - Appointment ID
     * @returns {Promise<Object>} Appointment data
     */
    async retrieve(id) {
        return this.http.get(`/appointments/${id}`);
    }

    /**
     * List appointments with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Paginated appointments
     */
    async list(params = {}) {
        return this.http.get('/appointments', params);
    }

    /**
     * Cancel an appointment
     * @param {string} id - Appointment ID
     * @returns {Promise<void>}
     */
    async cancel(id) {
        await this.http.delete(`/appointments/${id}`);
    }
}

class Departments {
    constructor(http) {
        this.http = http;
    }

    /**
     * List all departments
     * @returns {Promise<Array>} List of departments
     */
    async list() {
        return this.http.get('/departments');
    }

    /**
     * Retrieve a department by ID
     * @param {string} id - Department ID
     * @returns {Promise<Object>} Department data
     */
    async retrieve(id) {
        return this.http.get(`/departments/${id}`);
    }

    /**
     * Get availability for a department
     * @param {string} id - Department ID
     * @param {Object} params - Query parameters (startDate, endDate)
     * @returns {Promise<Object>} Availability data
     */
    async getAvailability(id, params) {
        return this.http.get(`/departments/${id}/availability`, params);
    }
}

class Moncreneau {
    /**
     * Initialize Moncreneau API client
     * @param {string} apiKey - Your Moncreneau API key
     * @param {Object} config - Optional configuration
     * @param {string} config.baseUrl - API base URL
     * @param {number} config.timeout - Request timeout in ms
     */
    constructor(apiKey, config = {}) {
        const http = new HttpClient({ apiKey, ...config });

        this.appointments = new Appointments(http);
        this.departments = new Departments(http);
    }

    /**
     * Verify webhook signature using HMAC-SHA256
     * @param {Object|string} payload - Webhook payload
     * @param {string} signature - Signature from X-Webhook-Signature header
     * @param {string} secret - Your webhook secret
     * @returns {boolean} True if signature is valid
     */
    static verifyWebhookSignature(payload, signature, secret) {
        const payloadString = typeof payload === 'string'
            ? payload
            : JSON.stringify(payload);

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payloadString);
        const computed = hmac.digest('hex');

        return computed === signature;
    }
}

module.exports = Moncreneau;
module.exports.Moncreneau = Moncreneau;
module.exports.MoncreneauError = MoncreneauError;
module.exports.default = Moncreneau;

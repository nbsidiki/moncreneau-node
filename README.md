# @moncreneau/api

Official Moncreneau API client for Node.js.

[![npm version](https://img.shields.io/npm/v/@moncreneau/api.svg)](https://www.npmjs.com/package/@moncreneau/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @moncreneau/api
# or
yarn add @moncreneau/api
```

## Quick Start

```javascript
const Moncreneau = require('@moncreneau/api');

const client = new Moncreneau('mk_live_YOUR_API_KEY');

// Create an appointment
const appointment = await client.appointments.create({
  departmentId: 5,  // Number: ID du département
  dateTime: '2026-01-20T10:00:00',
  name: 'Jean Dupont'  // Nom du bénéficiaire
});

console.log(appointment.id); // 123
```

## Documentation

Full documentation: [https://moncreneau-docs.vercel.app/docs/v1/sdks/nodejs](https://moncreneau-docs.vercel.app/docs/v1/sdks/nodejs)

## Features

- ✅ Simple & lightweight
- ✅ Promise-based API
- ✅ Automatic error handling
- ✅ Webhook signature verification
- ✅ Node.js 12+ support

## Usage

### Configuration

```javascript
const client = new Moncreneau('mk_live_...', {
  baseUrl: 'https://mc-prd.duckdns.org/api/v1', // optional
  timeout: 30000 // optional, in milliseconds
});
```

### Appointments

```javascript
// Create
const appointment = await client.appointments.create({
  departmentId: 5,  // Number: ID du département
  dateTime: '2026-01-20T10:00:00',
  name: 'Jean Dupont'  // Nom du bénéficiaire
});

// List
const appointments = await client.appointments.list({
  page: 0,
  size: 20,
  status: 'SCHEDULED'
});

// Retrieve
const appointment = await client.appointments.retrieve(123);

// Cancel
await client.appointments.cancel(123);
```

### Departments

```javascript
// List departments
const departments = await client.departments.list();

// Get availability
const availability = await client.departments.getAvailability('dept_123', {
  startDate: '2026-01-20',
  endDate: '2026-01-27'
});
```

### Error Handling

```javascript
const { MoncreneauError } = require('@moncreneau/api');

try {
  const appointment = await client.appointments.create({...});
} catch (error) {
  if (error instanceof MoncreneauError) {
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Details:', error.details);
  }
}
```

### Webhooks

```javascript
const Moncreneau = require('@moncreneau/api');

// Express.js example
app.post('/webhooks/moncreneau', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = Moncreneau.verifyWebhookSignature(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  const { type, data } = req.body;
  
  switch (type) {
    case 'APPOINTMENT_CREATED':
      console.log('New appointment:', data.id);
      break;
    case 'APPOINTMENT_CANCELLED':
      console.log('Appointment cancelled:', data.id);
      break;
  }
  
  res.status(200).send('OK');
});
```

## Express.js Example

```javascript
const express = require('express');
const Moncreneau = require('@moncreneau/api');

const app = express();
const client = new Moncreneau(process.env.MONCRENEAU_API_KEY);

app.use(express.json());

app.post('/appointments', async (req, res) => {
  try {
    // req.body doit contenir: departmentId (number), dateTime (string), name (string)
    const appointment = await client.appointments.create({
      departmentId: req.body.departmentId,  // Number
      dateTime: req.body.dateTime,
      name: req.body.name  // Nom du bénéficiaire
    });
    
    res.json(appointment);
  } catch (error) {
    if (error instanceof Moncreneau.MoncreneauError) {
      res.status(error.statusCode).json({
        error: error.code,
        message: error.message
      });
    } else {
      res.status(500).json({ error: 'Internal error' });
    }
  }
});

app.listen(3000);
```

## TypeScript

While this package is written in JavaScript, you can use it in TypeScript projects. JSDoc comments provide basic IntelliSense support.

## Support

- **Documentation**: [https://moncreneau-docs.vercel.app](https://moncreneau-docs.vercel.app)
- **NPM**: [https://www.npmjs.com/package/@moncreneau/api](https://www.npmjs.com/package/@moncreneau/api)
- **Email**: moncreneau.rdv@gmail.com
- **Issues**: [GitHub Issues](https://github.com/nbsidiki/moncreneau-node/issues)

## License

MIT © Moncreneau

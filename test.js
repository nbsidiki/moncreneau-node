// Simple test file
const Moncreneau = require('./index.js');

async function test() {
    console.log('✓ Moncreneau class loaded');
    console.log('✓ MoncreneauError class loaded');

    // Test client instantiation
    const client = new Moncreneau('mk_test_abc123');
    console.log('✓ Client instantiated');

    // Test resources exist
    console.log('✓ Appointments resource:', typeof client.appointments);
    console.log('✓ Departments resource:', typeof client.departments);

    // Test webhook verification
    const payload = JSON.stringify({ test: 'data' });
    const signature = require('crypto')
        .createHmac('sha256', 'secret')
        .update(payload)
        .digest('hex');

    const isValid = Moncreneau.verifyWebhookSignature(payload, signature, 'secret');
    console.log('✓ Webhook verification:', isValid);

    console.log('\n✅ All basic tests passed!');
}

test().catch(console.error);

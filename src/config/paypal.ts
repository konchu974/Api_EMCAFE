import * as paypal from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID as string;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET as string;
const envName = process.env.PAYPAL_ENV || 'sandbox';

function environment() {
    if (envName === 'live'){
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

export const paypalClient = new paypal.core.PayPalHttpClient(environment());


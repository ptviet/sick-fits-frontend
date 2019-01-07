// This is client side config only - don't put anything in here that shouldn't be public!
export const endpoint = `http://localhost:4444`;
export const endpointProd = process.env.ENDPOINT_PROD;
export const perPage = 4;
export const cloudinary = process.env.CLOUDINARY;
export const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
export const paymentIcon = `/static/paymentIcon.png`;

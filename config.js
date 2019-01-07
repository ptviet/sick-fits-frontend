// This is client side config only - don't put anything in here that shouldn't be public!
export const endpoint = `http://localhost:4444`;
export const endpointProd = process.env.endpointProd;
export const perPage = 4;
export const cloudinary = process.env.cloudinary;
export const stripePublishableKey = process.env.stripePublishableKey;
export const paymentIcon = `/static/paymentIcon.png`;

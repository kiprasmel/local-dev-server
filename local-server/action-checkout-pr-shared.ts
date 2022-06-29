export const actionId = "checkout-pr" as const;

export const httpStatus = {
	200: 200,
	300: 300,
	304: 304,
	400: 400,
	500: 500,
} as const;

export type HttpStatus = keyof typeof httpStatus;

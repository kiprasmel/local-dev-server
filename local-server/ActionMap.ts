import { actionCheckoutPR } from "./action-checkout-pr-performer";

// export type ActionMap = { [key: string]: Action };

// TODO TS SATISFIES `ActionMap`
export const allowedActions = {
	[actionCheckoutPR.id]: actionCheckoutPR,
} as const;

export type ActionMap = typeof allowedActions;

export type ActionId = keyof ActionMap;

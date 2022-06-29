/**
 * should be usable both in the client (web) & server (node etc)
 */

import { invokeCheckoutPR, InvokeCheckoutPRConfigBase } from "./action-checkout-pr-invoker";
import { LDSConfig } from "./config";

export class ApiClient {
	config: LDSConfig;

	constructor(config: LDSConfig) {
		this.config = config;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	invokeCheckoutPR(config: InvokeCheckoutPRConfigBase) {
		return invokeCheckoutPR({ ...this.config, ...config });
	}
}

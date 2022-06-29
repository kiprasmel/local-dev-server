import { getDefaultLDSConfig, LDSConfig } from "./config";

import { actionId } from "./action-checkout-pr-shared";

export type BranchOrPR = {
	branch: string;
};
// TODO:
// | {
// 		branch: string;
// 		pr?: never;
//   }
// | {
// 		branch?: never;
// 		pr?: string;
//   };

export type ProjectOrExactPath =
	| {
			project: string;
			exact_path?: never;
	  }
	| {
			project?: never;
			exact_path: string;
	  };

export type InvokeCheckoutPRConfigBase = ProjectOrExactPath & BranchOrPR & {};

export type InvokeCheckoutPRConfig = InvokeCheckoutPRConfigBase & {
	LDS?: LDSConfig;
};

export async function invokeCheckoutPR({
	LDS = getDefaultLDSConfig(), //
	//
	project,
	exact_path,
	//
	branch,
}: // pr, // TODO
InvokeCheckoutPRConfig): Promise<Response> {
	const host = `${LDS.hostname}:${LDS.port}`;

	// let url = `http://${host}/perform/${actionId}`;

	const url = new URL(`http://${host}/perform/${actionId}`);

	url.searchParams.append("branch", branch);

	if (exact_path) {
		url.searchParams.append("exact_path", exact_path);
	}
	if (project) {
		url.searchParams.append("project", project);
	}

	const res = await fetch(url.href, {
		method: "GET",
	});

	console.log({ res });

	// TODO proper handling (prolly improvements in server code as well)

	//

	return res;
}
export async function invokeCheckCurrentBranch({
	LDS = getDefaultLDSConfig(),
	//
	project, //
	exact_path,
}: Omit<InvokeCheckoutPRConfig, "branch">) {
	const host = `${LDS.hostname}:${LDS.port}`;

	const url = new URL(`http://${host}/check/current-branch`);

	if (exact_path) {
		url.searchParams.append("exact_path", exact_path);
	}
	if (project) {
		url.searchParams.append("project", project);
	}

	const res = await fetch(url.href, {
		method: "GET",
	});

	console.log({ res });

	// TODO proper handling (prolly improvements in server code as well)

	//

	return res;
}

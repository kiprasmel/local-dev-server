import type { PlasmoContentScript } from "plasmo";

import { GithubBtn } from "../checkout-pr/GithubBtn";
import { waitForEl } from "../util/waitForEl";

export const config: PlasmoContentScript = {
	// matches: ["https://github.com/*/*/pull/*"],
	matches: ["https://github.com/*"],
};

export const getRootContainer = async (): Promise<Element> => {
	console.log("getRootContainer");

	const id = "lds--checkout-pr";

	const existing = await waitForEl("#" + id, 100, true).catch(() => null);
	if (existing) {
		return existing;
	}

	const e = await waitForEl("get-repo", 3000)
		.then((el) => el.parentElement)
		.then((parent) => {
			console.log("parent", parent);

			const existing2 = document.getElementById(id);
			if (existing2) {
				return existing2;
			}

			const child = document.createElement("div");
			child.id = id;

			parent.appendChild(child);

			return child;
		});

	console.log("getRootContainer el:", e);

	return e;
};

export default GithubBtn;

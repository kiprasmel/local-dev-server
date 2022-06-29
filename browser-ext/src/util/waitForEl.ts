/**
 * https://stackoverflow.com/a/61511955/9285308
 */
export function waitForEl(selector: string, timeoutMs?: number): Promise<Element> {
	return new Promise((_resolve, reject) => {
		let done = false;
		const resolve = (x?: any) => {
			if (done) return;
			done = true;
			_resolve(x);
		};

		const el1 = document.querySelector(selector);
		if (el1) {
			return resolve(el1);
		}

		if (timeoutMs) {
			setTimeout(() => {
				if (done) return;

				console.error(`timeout waiting for element "${selector}".`);
				observer.disconnect();
				return reject();
			}, timeoutMs);
		}

		const observer = new MutationObserver(() => {
			const el2 = document.querySelector(selector);
			if (el2) {
				resolve(el2);
				observer.disconnect();
				return;
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

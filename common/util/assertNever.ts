export const assertNever = (x: never): never => {
	throw new Error(`expected never, got ${x}`);
};

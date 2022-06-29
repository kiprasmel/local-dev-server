import { createExecInDir } from "./execInDir";

export function getCurrentBranch(repoPath: string) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return createExecInDir(repoPath)(`git branch`)
		.split("\n")
		.find((x) => x.startsWith("* "))!
		.slice(2);
}

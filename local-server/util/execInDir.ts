import { execSync } from "child_process";

export type Exec = ReturnType<typeof createExecInDir>;

export const createExecInDir = (dir: string) => (cmd: string): string => {
	console.log("exec", cmd);

	return execSync(cmd, {
		cwd: dir, //
		encoding: "utf-8",
	});
};

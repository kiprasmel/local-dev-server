/* eslint-disable indent */

import os from "os";
import fs from "fs";
import path from "path";

import { assertNever } from "../common/util";

import { Action } from "./Action";
import { actionId, httpStatus } from "./action-checkout-pr-shared";
import { createExecInDir } from "./util/execInDir";
import { getCurrentBranch } from "./util/getCurrentBranch";

export const actionCheckoutPR: Action = {
	id: actionId,
	httpHandler: handleCheckoutPR,
} as const;

export function handleCheckoutPR(req: any, res: any): void {
	console.count("\nnew req");

	const {
		project,
		exact_path,
		//
		branch,
		pr,
		//
	} = req.query;

	const maybeProjectRepoDir = findProjectRepoDir({
		project, //
		exact_path,
	});

	if (!maybeProjectRepoDir.valid) {
		// TODO TS
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		return res.status(httpStatus[400]).send(maybeProjectRepoDir.msg!);
	}
	const { projectRepoDir } = maybeProjectRepoDir;

	if (!branch && !pr) {
		return res.status(httpStatus[400]).send(`one of "branch", "pr" query params are required.`);
	}

	if (!projectRepoDir || !projectRepoDir.length) {
		const msg =
			"project repo directory not found locally. tried inside " + directories_where_git_projects_live.join(", ");
		return res.status(httpStatus[400]).send(msg);
	}

	if (projectRepoDir.length > 1) {
		const msg = "multiple candidates found. select which one: " + (projectRepoDir as string[]).join(", ");
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300
		return res.status(httpStatus[300]).send(msg);

		/**
		 * after user selects, should send as query param `exact_path`
		 */
	}

	console.log({ projectRepoDir });

	if (branch && pr) {
		/**
		 * if identical, perform
		 * otherwise, reject
		 */

		// TODO
		return res.status(httpStatus[400]).send(`both "branch" and "pr" not supported yet, try with only "branch".`);
	} else if (pr) {
		// TODO
		return res.status(httpStatus[400]).send(`"pr" is not supported yet, try "branch".`);
	} else if (branch) {
		const checkoutBranchStatus: CheckoutBranchStatus = checkoutBranchInRepo(projectRepoDir[0], branch);

		const info = `${projectRepoDir} @ ${branch}`;

		if (checkoutBranchStatus === CheckoutBranchStatus.wasAlreadyCheckedOutUpdatedToLatestVersion) {
			const msg = "branch was already checked out. updated to latest version." + "\n" + info;
			return res.status(httpStatus[304]).json({
				msg,
				checkoutBranchStatus,
			});
		} else if (checkoutBranchStatus === CheckoutBranchStatus.fail) {
			const msg = "fail.";
			return res.status(httpStatus[500]).json({
				msg,
				checkoutBranchStatus,
			});
		} else if (checkoutBranchStatus === CheckoutBranchStatus.success) {
			return res.status(httpStatus[200]).send({
				msg: `success. ${info}`,
				checkoutBranchStatus,
			});
		} else {
			assertNever(checkoutBranchStatus);
		}
	} else {
		throw new Error("never");
	}
}

type FindProjectRepoDirRet =
	| {
			valid: true; //
			projectRepoDir: string[];
	  }
	| {
			valid: false; //
			msg: string;
	  };

type FindProjectRepoDirOpts =
	| {
			project: string;
			exact_path?: string;
	  }
	| {
			project?: string;
			exact_path: string;
	  };
export function findProjectRepoDir({ project, exact_path }: FindProjectRepoDirOpts): FindProjectRepoDirRet {
	if (!project && !exact_path) {
		return {
			valid: false,
			msg: `one of "project", "exact_path" query params are required.`,
		};
	}

	const projectRepoDir: string[] = exact_path
		? [decodeURIComponent(exact_path)] //
		: project
		? findLocalProjectRepo(project)
		: []; // TODO NEVER

	console.log({ projectRepoDir });

	return {
		valid: true,
		projectRepoDir,
	};
}

// TODO CONFIG
const directories_where_git_projects_live = [
	path.join(os.homedir(), "fun"), //
	path.join(os.homedir(), "projects"), //
	path.join(os.homedir(), "forkprojects"), //
];

function findLocalProjectRepo(projectName: string): string[] {
	const candidates = directories_where_git_projects_live
		.map((dir) => path.resolve(dir))
		.map((dir) => path.join(dir, projectName))
		.filter((p) => fs.existsSync(p));

	// handle `0` and `>1` cases urself
	return candidates;
}

enum CheckoutBranchStatus {
	wasAlreadyCheckedOutUpdatedToLatestVersion = "wasAlreadyCheckedOutUpdatedToLatestVersion",
	success = "success",
	fail = "fail",
}
function checkoutBranchInRepo(repoPath: string, branch: string): CheckoutBranchStatus {
	const exec = createExecInDir(repoPath);

	const currentBranch: string = getCurrentBranch(repoPath);
	console.log({ currentBranch, branch });

	if (branch === currentBranch) {
		exec(`git pull`);
		return CheckoutBranchStatus.wasAlreadyCheckedOutUpdatedToLatestVersion;
	}

	const getLocalBranches = () => exec(`git branch -l`);
	if (getLocalBranches().includes(branch)) {
		exec(`git checkout ${branch}`);
		exec(`git pull`);

		return CheckoutBranchStatus.success;
	}

	const getRemoteBranches = () => exec(`git branch -r`);

	if (getRemoteBranches().includes(branch)) {
		exec(`git checkout ${branch}`);
		exec(`git pull`);

		return CheckoutBranchStatus.success;
	}

	const maxParallel = 0;
	exec(`git -c fetch.parallel=${maxParallel} fetch --all`);

	if (getRemoteBranches().includes(branch)) {
		exec(`git checkout ${branch}`);

		return CheckoutBranchStatus.success;
	}

	return CheckoutBranchStatus.fail;
}

// TODO SEPARATE
export function performCheckCurrentlyCheckedOutBranch(req: any, res: any): string {
	const {
		project, //
		exact_path,
		//
	} = req.query;

	/** BEGIN COPYPASTA 1 */
	const maybeProjectRepoDir = findProjectRepoDir({
		project, //
		exact_path,
	});

	if (!maybeProjectRepoDir.valid) {
		// TODO TS
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		return res.status(400).send(maybeProjectRepoDir.msg!);
	}
	const { projectRepoDir } = maybeProjectRepoDir;
	/** END COPYPASTA 1 */

	/** BEGIN COPYPASTA 2 */
	if (!projectRepoDir || !projectRepoDir.length) {
		const msg =
			"project repo directory not found locally. tried inside " + directories_where_git_projects_live.join(", ");
		return res.status(httpStatus[400]).send(msg);
	}

	if (projectRepoDir.length > 1) {
		const msg = "multiple candidates found. select which one: " + (projectRepoDir as string[]).join(", ");
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300
		return res.status(httpStatus[300]).send(msg);

		/**
		 * after user selects, should send as query param `exact_path`
		 */
	}
	/** END COPYPASTA 2 */

	const currentBranch = getCurrentBranch(projectRepoDir[0]);

	return res.status(200).send(currentBranch);
}

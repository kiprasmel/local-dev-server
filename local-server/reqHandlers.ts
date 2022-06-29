import express from "express";
import { Action } from "./Action";
import { performCheckCurrentlyCheckedOutBranch } from "./action-checkout-pr-performer";
import { ActionId, allowedActions } from "./ActionMap";

const router = express.Router();

router.get(`/perform/:action`, (req, res) => {
	const actionId: ActionId | string = req.params["action"];

	const exists = actionId in allowedActions;
	if (!exists) {
		const msg = `invalid action name. got: "${actionId}", expected one of: ${Object.keys(allowedActions).join(
			", "
		)}`;
		return res.status(400).send(msg);
	}

	const action: Action = allowedActions[actionId as ActionId];
	return action.httpHandler(req, res);
});

// export type ExecQuery = {
// 	cmd: string; //
// };
// router.get("/exec", (req, res) => {
// 	const cmdQ: string = req.query["cmd"] as string; // TODO TS
// 	const cmd: string = decodeURIComponent(cmdQ) || "";

// 	console.log({ cmd });

// 	if (!cmd) return res.status(400).end();

// 	return res.status(200).send(cmd + "\n");
// });

router.get(`/check/current-branch`, performCheckCurrentlyCheckedOutBranch);

export { router as reqHandlersRouter };

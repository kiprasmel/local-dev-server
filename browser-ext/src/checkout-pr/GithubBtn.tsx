import { FC, useEffect, useState } from "react";

import { invokeCheckCurrentBranch, invokeCheckoutPR } from "../../../local-server/action-checkout-pr-invoker";
import { httpStatus } from "../../../local-server/action-checkout-pr-shared";

type Status = keyof typeof httpStatus | null | "unknown";

export const GithubBtn: FC = () => {
	const project: string = new URL(document.location.href).pathname.split("/")[2]; // TODO NON_GITHUB_SPECIFIC
	const branch: string = document.querySelector(".head-ref").textContent; // TODO NON_GITHUB_SPECIFIC

	const [status, setStatus] = useState<Status>(null);

	useEffect(() => {
		invokeCheckCurrentBranch({ project }).then(async (res) => {
			if (status) {
				return;
			}

			const currentBranch: string = await res.text();

			if (currentBranch === branch) {
				setStatus(httpStatus[200]);
			}
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClick = async () => {
		setStatus("unknown");

		// ?project=local-dev-server&branch=feature-a

		const res = await invokeCheckoutPR({ project, branch });
		console.log("res in client", res);

		const known = res.status in httpStatus;
		const newStatus: Status = !known ? "unknown" : (res.status as Status);

		setStatus(newStatus);

		// const body = await res.json();
		// console.log("res json", body);
	};

	const styling = {
		[httpStatus[200]]: {
			border: "2px solid green",
		},
		[httpStatus[300]]: {
			border: "2px solid yellow",
		},
		[httpStatus[304]]: {
			border: "2px solid blue",
		},
		[httpStatus[400]]: {
			border: "2px solid red",
		},
		[httpStatus[500]]: {
			border: "2px solid brown",
		},
		unknown: {
			border: "2px solid gray",
		},
	};

	const style = !status ? {} : styling[status];

	return (
		<>
			<button
				type="button"
				title={branch}
				onClick={handleClick}
				className="btn btn-sm d-inline-block m-0 ml-2" // TODO NON_GITHUB_SPECIFIC
				style={style}
			>
				<span>CO</span>
			</button>
		</>
	);
};

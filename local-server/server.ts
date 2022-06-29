import os from "os";
import { Server } from "http";

import express from "express";
import cors from "cors";

import { LDSConfig, getDefaultLDSConfig } from "./config";

import { reqHandlersRouter } from "./reqHandlers";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use("/", reqHandlersRouter);

export function run(_config: LDSConfig = getDefaultLDSConfig()): Server {
	const config: LDSConfig = {
		...getDefaultLDSConfig(), //
		..._config,
	};
	const {
		hostname, //
		port,
	} = config;

	const server: Server = app.listen(port, hostname, () => {
		console.log(`[LDS] running at ${hostname}:${port}`);
	});

	return server;
}

let s: Server;

if (!module.parent) {
	s = run();
}

const handleClose = (signal: number) => (): void => {
	if (s) {
		s.close();
	}

	process.exit(signal);
};
process.on("SIGTERM", handleClose(os.constants.signals.SIGTERM));
process.on("SIGINT", handleClose(os.constants.signals.SIGINT));

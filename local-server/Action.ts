export type Action = {
	id: string;
	httpHandler: (req: any, res: any) => any; // TODO TS // TODO RENAME "perform"
	// clientLibraryHandler: any; // TODO TS // TODO RENAME "invoke"
};

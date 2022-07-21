export type LDSConfig = {
	hostname: string; //
	port: number;
};

export const getDefaultLDSConfig = (): LDSConfig => ({
	hostname: "localhost", //
	port: 14480,
});

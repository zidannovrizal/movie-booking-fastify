import "dotenv/config";
export declare const config: {
    readonly port: string | 3000;
    readonly host: string;
    readonly corsOrigin: string;
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string;
    readonly databaseUrl: string;
};

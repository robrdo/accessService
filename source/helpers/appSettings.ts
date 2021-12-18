import { ApplicationSettings } from "../data/models/dto";
import 'dotenv/config';
import { DbProvider } from "../dal/dbProvider";

export interface AppSettings {
    readonly jwtSecret: string
    readonly apiKeyValidOnlyForIssuer: boolean
    readonly dbPath: string
}

export class AppSettingsProvider implements AppSettings {

    //#region singleton

    private static _instance: AppSettingsProvider

    static async GetInstance(dbProvider: DbProvider): Promise<AppSettingsProvider> {
        if (!dbProvider.isInit()) {
            throw new Error("not init");
        }
        let dbSettings = await this.getSettingsFromDb();
        let envSettings = process.env;
        return this._instance ?? new AppSettingsProvider(dbSettings.apiKeyValidOnlyForIssuer, envSettings.DB_PATH ?? "", envSettings.JWT_SECRET);//TODO: BETEER WAY?
    }

    //#endregion

    private constructor(apiKeyValidOnlyForIssuer: boolean, dbPath: string, jwt: string) {
        this.jwtSecret = jwt;
        this.apiKeyValidOnlyForIssuer = apiKeyValidOnlyForIssuer;
        this.dbPath = dbPath;
    }

    readonly dbPath: string;
    readonly jwtSecret: string;
    readonly apiKeyValidOnlyForIssuer: boolean;

    private static async getSettingsFromDb(): Promise<ApplicationSettings> {
        //TODO INJECT AND THROW IF NOT INIT
        let app: ApplicationSettings = {
            apiKeyValidOnlyForIssuer: false
        };
        return app;
    }

    private getSettingsFromEnv() {

    }
}
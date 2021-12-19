import { ApplicationSettings } from "../data/models/dto";
import 'dotenv/config';
import DbProvider from "../dataAccessLayer/dbProvider";
import { container } from "tsyringe";

//decorates appconfig from different sources
export interface AppSettings {
    readonly jwtSecret: string
    readonly apiKeyValidOnlyForIssuer: boolean
}

export class AppSettingsProvider implements AppSettings {

    //#region singleton

    private static _instance: AppSettingsProvider

    static async GetInstance(dbProvider: DbProvider): Promise<AppSettings> {
        if (!dbProvider.isInit()) {
            throw new Error("not init");
        }
        let dbSettings = await this.getSettingsFromDb();
        let envSettings = process.env;
        return this._instance ?? new AppSettingsProvider(dbSettings.apiKeyValidOnlyForIssuer, envSettings.JWT_SECRET);
    }

    //#endregion

    private constructor(apiKeyValidOnlyForIssuer: boolean, jwt: string) {
        //throw
        this.jwtSecret = jwt;
        this.apiKeyValidOnlyForIssuer = apiKeyValidOnlyForIssuer;
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
}
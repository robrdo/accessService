import "reflect-metadata";
import { ApplicationSettings } from "../../data/models/dto";
import 'dotenv/config';
import DbProvider from "../../dataAccessLayer/dbProvider";
import { ApplicationSettingsModel } from "../../dataAccessLayer/dbModels/dbmodels";

//decorates appconfig from different sources
export class AppSettings {
    readonly jwtSecret: string
    readonly apiKeyValidOnlyForIssuer: boolean
}

export class AppSettingsProvider {

    //#region singleton

    private static _instance: AppSettings

    static async GetSettings(dbProvider: DbProvider): Promise<AppSettings> {
        if (this._instance) {
            return this._instance;
        }
        
        if (!dbProvider.isInit()) {
            throw new Error("not init");
        }
        let dbSettings = await this.getSettingsFromDb();
        let envSettings = process.env;
        this._instance = new AppSettingsProvider(dbSettings.apiKeyValidOnlyForIssuer, envSettings.JWT_SECRET);
    }

    //#endregion

    readonly dbPath: string;
    readonly jwtSecret: string;
    readonly apiKeyValidOnlyForIssuer: boolean;

    private constructor(apiKeyValidOnlyForIssuer: boolean, jwt: string) {
        //throw on invalid params
        this.jwtSecret = jwt;
        this.apiKeyValidOnlyForIssuer = apiKeyValidOnlyForIssuer;
    }

    private static async getSettingsFromDb(): Promise<ApplicationSettings> {
        return await ApplicationSettingsModel.findOne();
    }
}
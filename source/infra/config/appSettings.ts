import 'dotenv/config';
import "reflect-metadata";
import { injectable, singleton } from 'tsyringe';
import { ApplicationSettings } from "../../data/models/dto";
import { ApplicationSettingsModel } from "../../dataAccessLayer/dbModels/dbmodels";
import DbProvider from "../../dataAccessLayer/dbProvider";

//decorates appconfig from different sources
@singleton()
export class AppSettings {
    readonly jwtSecret: string
    readonly apiKeyValidOnlyForIssuer: boolean
}

export class AppSettingsProvider implements AppSettings {

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
        let jwt = process.env.JWT_SECRET;
        this._instance = new AppSettingsProvider(dbSettings.apiKeyValidOnlyForIssuer, jwt);
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
import bcrypt, { hash, compare } from "bcrypt";
import apiKeygenerator, { } from 'generate-api-key';
import { resolve } from "path/posix";
import { Model } from "sequelize-typescript";
import { ApiKeyModel, UserModel } from "../dal/dbModels/dbmodels";
import { ApiKey, ApiKeyStatus, Permissions } from "../data/models/dto";
import { AppSettings } from "../helpers/appSettings";

export interface IApiKeyService {

}

export class ApiKeyService implements IApiKeyService {
    //TODO: before ctor or after fields
    private static readonly _salt: number = 10;

    constructor(private appSettings: AppSettings) {

    }

    //TODO: put validation in another file split to function
    public async generateApiKey(userId: number, requiredPermissions: Permissions): Promise<string | null> {

        //todo: validateUserExist
        this.validateKeyGeneration(userId, requiredPermissions);
        return await this.createKey(userId, requiredPermissions).then(res => resolve(res.token));
    }

    //#region apiKeyGeneration

    private async createKey(userId: number, requiredPermissions: Permissions): Promise<ApiKey | null> {
        let key: string = apiKeygenerator.generateApiKey();
        console.log('AHTUNG, generated code ' + key);
        let model = new ApiKeyModel({
            userId: userId,
            status: ApiKeyStatus.Active,
            requiredPermissions: requiredPermissions
        })
        return await bcrypt.hash(key, ApiKeyService._salt).then(async value => {
            model.token = value
            return await model.save();
        }).then((resolve) => resolve);
    }

    //could be overhead for often call, consider encryption over hash
    private async getApiKeyFromDb(userId: number, apiKey: string): Promise<ApiKey | null> {
        let encryptedKey = await bcrypt.hash(apiKey, ApiKeyService._salt);
        //INJECT
        await ApiKeyModel.findOne()
        //consider repo and move method out
        let result = await ApiKeyModel.findOne();
        /*{findall
            where: { token === encryptedKey
        });*/
        return result;
    }

    private async getApiKeysFromDb(userId: number): Promise<ApiKey[] | null> {
        return await ApiKeyModel.findAll();
    }

    private async validateKeyGeneration(userId: number, requiredPermissions: Permissions): Promise<boolean> {
        //inject method
        let existingApis = await this.getApiKeysFromDb(userId);
        //TODO: VALID?
        if (!existingApis.length) {
            return new Promise(resolve => resolve(true));
        }
        //TODO: == or ===        
        let sameKeyExist = existingApis.find(x => x.status === ApiKeyStatus.Revoked && x.permissions === requiredPermissions);
        if (sameKeyExist) {
            throw ("cannot genenerate api key, reason the key with required permissions already exists ");
        }
        //get user permission from db
        let userPermissions: Permissions = Permissions.Create;
        //TODO: HOW TO BETTER THROW or return we cannot know about http error or return bool + message
        if (requiredPermissions > userPermissions) {
            throw ("baaad permissions");
        }
        //how better
        return new Promise(resolve => resolve(true));
    }

    //#endregion

    public async getApiKey(userId: number, token: string): Promise<ApiKey | null> {
    //check if token belongs to user
    return await ApiKeyModel.findOne();
    }

    //decouple move to apikeyvalidator
    public async validateExistingKey(userId: number, apiKey: string): Promise<boolean> {
        //put db out
        let validKey = await this.getApiKeyFromDb(userId, apiKey);

        //todo: how better
        if (validKey === null || validKey.status !== ApiKeyStatus.Active) {
            return false;
        }

        //check if api key per user
        if (this.appSettings.apiKeyValidOnlyForIssuer && userId != validKey.userId) {
            throw ("AYAYAYA");
        }

        return true;
    }

    public async revoke(userId: number, key: string) {
        //check if key belongs to user
        //go to db delete key
        //add hash
        let apiKey = await ApiKeyModel./*include*/findOne();
        if (apiKey.user.id !== userId) {
            //throw unathorized (only user can delete key)
            //customize behavior by settings future improv
        }
        await ApiKeyModel.destroy(apiKey.id);
    }
}
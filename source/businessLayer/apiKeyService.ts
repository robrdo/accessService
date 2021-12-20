import "reflect-metadata";
import bcrypt, { hash, compare } from "bcrypt";
//import apiKeygenerator, { } from 'generate-api-key';
import { resolve } from "path/posix";
import { ApiKeyModel, UserModel } from "../dataAccessLayer/dbModels/dbmodels";
import { ApiKey, ApiKeyStatus, Permissions } from "../data/models/dto";
import ApiKeyValidator from "./validators/apiKeyValidator";
import { singleton } from "tsyringe";
import generateApiKey from 'generate-api-key';

@singleton()
export default class ApiKeyService {
    private static readonly _salt: number = 10;

    constructor(private apiKeyValidator: ApiKeyValidator) {
    }

    async generateApiKey(userId: number, requiredPermissions: Permissions): Promise<string | null> {
        //since we "passed" auth we assume what user exist 
        let userKeys = await this.getApiKeysByUserFromDb(userId);
        let userPermissions = await UserModel.findOne({ where: { id: userId } });
        let isValidForGenerate = this.apiKeyValidator.isUserValidForIssuingKey(requiredPermissions, userPermissions.permissions, userKeys);
        if (!isValidForGenerate[0]) {
            throw new Error(isValidForGenerate[1]);
        }
        return await this.createKey(userId, requiredPermissions).then(res => resolve(res.token));
    }

    //#region apiKeyGeneration

    private async createKey(userId: number, requiredPermissions: Permissions): Promise<ApiKey | null> {
        
        let key: string = "fgffg-dfgdfgdf-dfgdfg-dfg";//generateApiKey.generateApiKey();//apiKeygenerator.generateApiKey();
        console.log('AHTUNG, generated code ' + key);
        let model = new ApiKeyModel({
            userId: userId,
            status: ApiKeyStatus.Active,
            requiredPermissions: requiredPermissions
        })
        //TODO: WHY WEIRD GEN
        return await bcrypt.hash(key, ApiKeyService._salt).then(async value => {
            model.token = value
            return await model.save();
        })
    }

    //could be overhead for often call, consider encryption over hash
    private async getApiKeyFromDb(apiKey: string): Promise<ApiKey | null> {
        let encryptedKey = await bcrypt.hash(apiKey, ApiKeyService._salt);
        return await ApiKeyModel.findOne({ where: { token: encryptedKey } });
    }

    //move to repo
    private async getApiKeysByUserFromDb(userId: number): Promise<ApiKey[] | null> {
        return await ApiKeyModel.findAll({ where: { userId: userId } });
    }

    //#endregion

    async getApiKey(userId: number, token: string): Promise<ApiKey | null> {
        return await this.getApiKeyFromDb(token);
    }

    async revoke(userId: number, apiKey: string) {
        let encryptedKey = await bcrypt.hash(apiKey, ApiKeyService._salt);
        let result = await ApiKeyModel.findOne({ where: { token: encryptedKey }, include: UserModel });

        if (!result) {
            throw new Error("KeyNotFound");
        }
        if (result.user.id !== userId) {
            throw new Error("Unauthorised");
        }
        await ApiKeyModel.destroy(result.id);
    }

    async validateExistingKeyByTokenString(userId: number, apiKey: string): Promise<[boolean, string]> {
        let validKey = await this.getApiKeyFromDb(apiKey);
        return this.validateExistingKey(userId, validKey);
    }

    async validateExistingKey(userId: number, validKey: ApiKey): Promise<[boolean, string]> {

        if (!validKey || validKey.status !== ApiKeyStatus.Active) {
            return [false, 'outdated key'];
        }

        if (this.apiKeyValidator.isKeyOnlyForIssuer) {
            return [false, 'key can be only used by issuer'];
        }

        return [true, ''];
    }
}
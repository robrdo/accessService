import uuidAPIKey from "uuid-apikey";
//import apiKeygenerator, { } from 'generate-api-key';
import { resolve } from "path/posix";
import "reflect-metadata";
import { singleton } from "tsyringe";
import { ApiKey, ApiKeyStatus, Permissions } from "../data/models/dto";
import { ApiKeyModel, UserModel } from "../dataAccessLayer/dbModels/dbmodels";
import { BusinessError } from "./errors/logicError";
import ApiKeyValidator from "./validators/apiKeyValidator";

@singleton()
export default class ApiKeyService {
    private static readonly _salt: number = 10;

    constructor(private apiKeyValidator: ApiKeyValidator) {
    }

    async generateApiKey(userId: number, requiredPermissions: Permissions): Promise<string | null> {
        //since we "passed" auth we assume what user exist 
        let userKeys = await this.getApiKeysByUserFromDb(userId);
        let userModel = await UserModel.findOne({ where: { id: userId } });
        let isValidForGenerate = this.apiKeyValidator.isUserValidForIssuingKey(requiredPermissions, userModel.permissions, userKeys);
        if (!isValidForGenerate[0]) {
            throw new BusinessError(isValidForGenerate[1]);
        }
        return await this.createKey(userId, requiredPermissions).then(res => res[0]);
    }

    //#region apiKeyGeneration

    private async createKey(userId: number, requiredPermissions: Permissions): Promise<[string, ApiKey] | null> {
        let model = new ApiKeyModel({
            userId: userId,
            status: ApiKeyStatus.Active,
            permissions: requiredPermissions
        })

        //check how it works under the hood in case we need Promise
        let key = uuidAPIKey.create();
        model.token = key.uuid
        console.log(key.apiKey);
        await model.save();
        return [key.apiKey, model]
    }

    //could be overhead for often call, consider encryption over hash
    private async getApiKeyFromDb(apiKey: string): Promise<ApiKey | null> {
        let uuidKey = uuidAPIKey.toUUID(apiKey);
        return await ApiKeyModel.findOne({ where: { token: uuidKey } });
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
        let uuidKey = uuidAPIKey.toUUID(apiKey);
        let apiKeyModel = await ApiKeyModel.findOne({ where: { token: uuidKey }, include: UserModel });

        if (!apiKeyModel) {
            throw new BusinessError("KeyNotFound");
        }
        if (apiKeyModel.user.id !== userId) {
            throw new BusinessError("Unauthorised - only issuer can delete that key");
        }
        apiKeyModel.status = ApiKeyStatus.Revoked;
        await apiKeyModel.save();
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
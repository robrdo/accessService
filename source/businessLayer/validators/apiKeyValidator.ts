import "reflect-metadata";
import { singleton } from "tsyringe";
import { AppSettings } from "../../infra/config/appSettings";
import { ApiKey, ApiKeyStatus, Permissions } from "../../data/models/dto";

@singleton()
export default class ApiKeyValidator {

    constructor(private appSettings: AppSettings) {

    }

    isKeyOnlyForIssuer(requestedUserId: number, issuerUserId: Number) {
        return this.appSettings.apiKeyValidOnlyForIssuer && requestedUserId != issuerUserId;
    }

    isUserValidForIssuingKey(requiredPermissions: Permissions, userPermissions: Permissions, existingApiKeysForUser: ApiKey[]): [boolean, string] {
        if (requiredPermissions > userPermissions) {
            return [false, "cannot genenerate api key, reason: required permission doesn't match user permissions"];
        }if (!existingApiKeysForUser.length) {
            return [true, ""];
        }
        let sameKeyExist = existingApiKeysForUser.find(x => x.status !== ApiKeyStatus.Revoked && x.permissions == requiredPermissions);
        if (sameKeyExist) {
            return [false, "cannot genenerate api key, reason: the key with required permissions already exists"];
        }
        return [true, ""];
    }
}
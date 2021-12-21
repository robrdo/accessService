import jwt from "jsonwebtoken";
import "reflect-metadata";
import { injectable, singleton } from "tsyringe";
import { Permissions } from "../data/models/dto";
import DbProvider from "../dataAccessLayer/dbProvider";
import { AppSettings, AppSettingsProvider } from "../infra/config/appSettings";
import PermissionsHelper from "./helpers/permissionHelper";

@singleton()
@injectable()
export default class JWTService {
    constructor(private appSettings: AppSettings, private permissionHelper: PermissionsHelper) {
    }

    async generateToken(userId: number, requiredPermissions: Permissions): Promise<string> {
        let parsePermissions = this.permissionHelper.parseBack(requiredPermissions);

        let set = AppSettingsProvider.GetSettings(new DbProvider());
        let token = await jwt.sign(
            {
                user_id: userId,
                permissions: parsePermissions
            },
            this.appSettings.jwtSecret,
            {
                expiresIn: "3h",
            }
        );
        return token;
    }

    validateToken(token: string): boolean {
        //validates token change to jwt
        try {
            let decoded = jwt.verify(token, this.appSettings.jwtSecret);
        } catch (err) {
            return false;
        }
        return true;
    }
}
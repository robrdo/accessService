import jwt from "jsonwebtoken";
import "reflect-metadata";
import { injectable, singleton } from "tsyringe";
import { Permissions } from "../data/models/dto";
import DbProvider from "../dataAccessLayer/dbProvider";
import { AppSettings, AppSettingsProvider } from "../infra/config/appSettings";
import PermissionsHelper from "./helpers/permissionHelper";

@singleton()
export default class JWTService {
    private jwtSecret: string;
    constructor(private appSettings: AppSettings, private permissionHelper: PermissionsHelper) {
        //todo issue with appsettings resolve from container, check
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async generateToken(userId: number, requiredPermissions: Permissions): Promise<string> {
        let parsePermissions = this.permissionHelper.parseBack(requiredPermissions);
        //todo: put expiration in settings
        let token = await jwt.sign(
            {
                user_id: userId,
                permissions: parsePermissions
            },
            this.jwtSecret,
            {
                expiresIn: "3h",
            }
        );
        return token;
    }

    validateToken(token: string): boolean {
        //validates token change to jwt
        try {
            let decoded = jwt.verify(token, this.jwtSecret);
        } catch (err) {
            return false;
        }
        return true;
    }
}
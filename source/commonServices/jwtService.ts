import { AppSettings } from "../helpers/appSettings";
import jwt, { } from "jsonwebtoken";
import { Permissions } from "../data/models/dto";

export default class JWTService {
    constructor(private appSettings: AppSettings) {
    }

    //@singleton
    async generateToken(userId: number, requiredPermissions: Permissions): Promise<string> {
        let permissions = Object.values(Permissions).filter(value => typeof value === 'string')
        let token = await jwt.sign(
            {
                user_id: userId,
                permissions: permissions
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
import { AppSettings } from "../helpers/appSettings";
import jwt, { } from "jsonwebtoken";
import { json } from "stream/consumers";
import { Permissions } from "../data/models/dto";

export class JWTService {
    constructor(private appSettings: AppSettings) {
    }

    //todo:move nah export internal
    public async generateToken(userId: number, requiredPermissions: Permissions): Promise<string> {
        //singleton
        // get token from db once and store
        //consider performance over safety on storing unhashed secret
        //TODO turn into string
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
        return token;/*,email */
    }

    public validateToken(token: string): boolean {
        //validates token change to jwt
        try {
            let decoded = jwt.verify(token, this.appSettings.jwtSecret);
        } catch (err) {
            return false;
        }
        return true;
    }
}
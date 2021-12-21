import "reflect-metadata";
import { singleton } from "tsyringe";
import JWTService from "../commonServices/jwtService";
import { Permissions, TokenHistory } from "../data/models/dto";
import TokensResponse from "../data/responseModels/tokensResponse";
import { TokenHistoryModel } from "../dataAccessLayer/dbModels/dbmodels";

@singleton()
export default class TokenService {

    constructor(private jwtService: JWTService) {

    }

    async generateToken(userId: number, apiKeyId: number, requiredPermissions: Permissions): Promise<string> {
        let token = await this.jwtService.generateToken(userId, requiredPermissions);
        new TokenHistoryModel({
            token: token,
            relatedApiKeyId: apiKeyId,
            permissions: requiredPermissions,
            lastUpdate: Date.now()
        });
        //update apiKeyUsage table
        return token;
    }

    async getTokensHistory(): Promise<TokensResponse[]> {
        let tokens: TokenHistory[] = await TokenHistoryModel.findAll();
        let result = tokens.map(t => {
            if (t.token) {
                return <TokensResponse>{
                    token: this.obstructToken(t.token),
                    lastUpdateDate: t.lastUpdate,
                    status: this.getStatusOfToken(t.token)
                }
            };
        });
        return new Promise<TokensResponse[]>(resolve => resolve(result));
    }

    //#region methods

    private obstructToken(token: string): string {
        return "***" + token.substring(token.length - 4);
    }

    private getStatusOfToken(token: string): string {
        return this.jwtService.validateToken(token) ? 'active' : 'expired';
    }

    //#endregion
}
export interface ITokenService {
    getTokensHistory(): Promise<TokensResponse[]>
}

import { TokenHistoryModel } from "../dal/dbModels/dbmodels";
import { Permissions, TokenHistory } from "../data/models/dto";
import { TokensResponse } from "../responseModels/tokensResponse";
import { JWTService } from "../services/jwtService";

//rename to bl
export class TokenService implements ITokenService {

    constructor(private jwtService: JWTService) {

    }

    async generateToken(userId: number, requiredPermissions : Permissions): Promise<string> {
        let token = await this.jwtService.generateToken(userId, requiredPermissions);
        //put in db
        return token;
    }

    /*private async updateUsage(userId: number): Promise<string> {

    }*/

    //TODO: should I use any or response for every shit
    async getTokensHistory(): Promise<TokensResponse[]> {
        //getfromdb
        let tokens: TokenHistory[] = await TokenHistoryModel.findAll();

        //TODO: SHOULD I WRAP with async when await is not here
        let result = tokens.map(t => {
            //TODO : is this a better way to write it
            return <TokensResponse>{
                token: this.obstructToken(t.token ?? ""),
                lastUpdateDate: t.lastUpdate,
                status: this.getStatusOfToken(t.token ?? "")
            };
        });
        return new Promise<TokensResponse[]>(resolve => resolve(result));
    }

    //#region  methods

    private obstructToken(token: string): string {
        //TODO: how to design
        return "***" + token.substring(token.length - 4);
    }

    private getStatusOfToken(token: string): string {
        return this.jwtService.validateToken(token) ? 'active' : 'expired';
    }

    //#endregion
}
import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { ne } from "sequelize/lib/operators";
import { injectable } from "tsyringe";
import ApiKeyService from "../../businessLayer/apiKeyService";
import { BusinessError } from "../../businessLayer/errors/logicError";
import TokenService from "../../businessLayer/tokenService";
import PermissionsHelper from "../../commonServices/helpers/permissionHelper";
import { removeBraces } from "../../commonServices/helpers/stringHelper";
import { ApiKey } from "../../data/models/dto";
import TokensResponse from "../../data/responseModels/tokensResponse";
import { deleteApi } from "../../infra/routing/routeDecorators/deleteDecorator";
import { getApi } from "../../infra/routing/routeDecorators/getDecorator";
import { postApi } from "../../infra/routing/routeDecorators/postDecorator";
import HttpException from "../exceptions/httpException";

@injectable()
export default class AccessServiceController {

  constructor(private apiKeyService: ApiKeyService,
    private tokenService: TokenService,
    private permissionsHelper: PermissionsHelper) {
  }

  @postApi('')
  async createAPIkey(request: Request, response: Response, next: NextFunction): Promise<void> {
    let apiKey: string;
    try {
      let userId = Number(request.headers.userid);
      let requestPermissions = request.body['permissions'];
      if (!requestPermissions) {
        return next(new HttpException(400, "permissions params"))
      }
      let requiredPermissions = this.permissionsHelper.parseFromArray(requestPermissions, true);
      apiKey = await this.apiKeyService.generateApiKey(userId, requiredPermissions);
    }
    catch (e) {
      let er = this.logAndFormatError(e)
      return next(er);
    };
    response.send({
      apikey: apiKey
    });
  }

  @postApi('authentithicate')
  async useAPIKey(request: Request, response: Response, next: NextFunction) {
    let resultToken: string;
    try {
      let userId: number = Number(request.headers.userid);
      let apiKey: string = removeBraces(request.headers['api-key'].toString()).trim();
      let apiKeyFromDb: ApiKey = await this.apiKeyService.getApiKey(userId, apiKey);
      if (!apiKeyFromDb || !await this.apiKeyService.validateExistingKey(userId, apiKeyFromDb)) {
        return next(new HttpException(400, 'invalid ApiKey'));
      }
      resultToken = await this.tokenService.generateToken(userId, apiKeyFromDb.id, apiKeyFromDb.permissions);
    }
    catch (e) {
      return next(this.logAndFormatError(e));
    }

    response.send({
      token: resultToken
    });
  }

  @deleteApi(':apikey')
  async revokeAPIKey(request: Request, response: Response, next: NextFunction) {
    try {
      let userId = Number(request.headers.userid);
      let apikey = request.params.apikey.toString();
      apikey = removeBraces(apikey).trim();
      if (!apikey) {
        return next(new HttpException(400, 'no api-key presented'));
      }
      await this.apiKeyService.revoke(userId, apikey);
    }
    catch (e) {
      return next(this.logAndFormatError(e));
    }
    response.status(200).send({
      status: 'deleted'
    });
  }

  @getApi('')
  async getTokens(request: Request, response: Response, next: NextFunction) {
    let tokens: TokensResponse[];
    try {
      tokens = await this.tokenService.getTokensHistory()
    }
    catch (e) {
      return next(this.logAndFormatError(e));
    }

    response.send({
      tokens: tokens
    });
  }

  //#region  methods

  //todo move to base controller
  logAndFormatError(e: any): HttpException {
    console.log(e);
    let promptMessage: BusinessError = e as BusinessError;
    return new HttpException(500, promptMessage ? promptMessage.message : '');
  }

  //#endregion
}

import "reflect-metadata";
import express, { Request, Response, Express, NextFunction } from "express";
import { autoInjectable, container, injectable, singleton } from "tsyringe";
import ApiKeyService from "../../businessLayer/apiKeyService";
import TokenService from "../../businessLayer/tokenService";
import { ApiKey, Permissions } from "../../data/models/dto";
import { deleteApi } from "../../infra/routing/routeDecorators/deleteDecorator";
import { getApi } from "../../infra/routing/routeDecorators/getDecorator";
import { postApi } from "../../infra/routing/routeDecorators/postDecorator";
import HttpException from "../exceptions/httpException";
import { nextTick } from "process";

@injectable()
export default class AccessServiceController {

  constructor(private apiKeyService: ApiKeyService,
    private tokenService: TokenService) {
  }

  @postApi('')
  async createAPIkey(request: Request, response: Response): Promise<void> {
    let apiKeyService = container.resolve(ApiKeyService);
    let userId = Number(request.headers.userid);
    console.log("uid" + request.headers.userid);
    //validate permissions
    let permParam = request.body.permissions;
    console.log("permParam");
    console.log(permParam);
    let permissions: string[] = ['Read'];
    let requiredPermission: Permissions = Permissions.Read;
    //todo: validate enum with ignore case
    /*permissions.forEach(element => {
      let index:any = Permissions[<any>element];
      requiredPermission |=  Permissions[<any>index];
    });*/
    let apiKey = await apiKeyService.generateApiKey(userId, requiredPermission);
    response.send({
      apikey: apiKey
    });
  }

  //post/authentithicate
  @postApi('authentithicate')
  async useAPIKey(request: Request, response: Response, next: NextFunction) {
    let apiKeyService = container.resolve(ApiKeyService);
    let tokenService = container.resolve(TokenService);
    let userId: number = Number(request.headers.userid);
    let apiKey: string = request.headers['api-key'].toString();
    let apiKeyFromDb: ApiKey = await apiKeyService.getApiKey(userId, apiKey);
    if (!await apiKeyService.validateExistingKey(userId, apiKeyFromDb)) {
      next("ivalid ApiKey");
    }
    //into object
    return await tokenService.generateToken(userId, apiKeyFromDb.id, apiKeyFromDb.permissions);
  }

  //DELETE /{:id}
  @deleteApi('')//'/{:id}')
  async revokeAPIKey(request: Request, response: Response, next: NextFunction) {
    let apiKeyService = container.resolve(ApiKeyService);
    let userId = Number(request.headers.userid);
    let apikey = request.headers['api-key'].toString();
    if (!apikey) {
      next(new HttpException(400, 'no api-key presented'));
    }
    return await apiKeyService.revoke(userId, apikey);
  }

  @getApi('')
  async getTokens(request: Request, response: Response, next: NextFunction) {
    //issue with di
    let tokenService = container.resolve(TokenService);
    return await tokenService.getTokensHistory().
      then((tokens) => {
        if (tokens) {
          response.send(tokens);
        } else {
          //SHOULD I SEND THST OR LIST EMPTY
          next(new HttpException(404, 'Post not found'));
          //response.status(404).send({ error: 'TOKENs not found' });
        }
      });
  }
}

/*
export class EnumHelper {
  parse<TEnum>(value : string){
/*if (value in TEnum)
  }*/
//}

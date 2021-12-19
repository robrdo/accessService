import "reflect-metadata";
import express, { Request, Response, Express, NextFunction } from "express";
import { autoInjectable, injectable, singleton } from "tsyringe";
import ApiKeyService from "../../businessLayer/apiKeyService";
import TokenService from "../../businessLayer/tokenService";
import { Permissions } from "../../data/models/dto";
import { deleteApi } from "../../infra/routing/routeDecorators/deleteDecorator";
import { getApi } from "../../infra/routing/routeDecorators/getDecorator";
import { postApi } from "../../infra/routing/routeDecorators/postDecorator";
import HttpException from "../exceptions/httpException";
import { get } from "http";

@autoInjectable()
export default class AccessServiceController {

  constructor(private apiKeyService: ApiKeyService,
    private tokenService: TokenService) {
    console.log('ctrl ctor');
  }

  @getApi('health')
  healthCheck(request: Request, response: Response) {
    response.send(
      {
        yeahbaby: 'mafucka'
      }
    );
  }

  //post
  @postApi('')
  async createAPIkey(request: Request, response: Response): Promise<void> {
    //get userid from request
    let userId = 1;
    //validate permissions
    let permissions: string[] = ['Read'];
    let requiredPermission: Permissions = Permissions.Read;
    //todo: validate enum with ignore case
    /*permissions.forEach(element => {
      let index:any = Permissions[<any>element];
      requiredPermission |=  Permissions[<any>index];
    });*/
    await this.apiKeyService.generateApiKey(userId, requiredPermission);
    response.send();
  }

  //post/authentithicate
  @postApi('/authentithicate')
  //@jwtAuth
  async useAPIKey(request: Request, response: Response, next: NextFunction) {
    let userId: number = Number(request.params.userId);
    //add validate if (id) undefined
    //get token from request
    let paramKey: string = "ddf";
    //put into bl //todo should i call it bl
    //?? vs ||
    let apiKey = await this.apiKeyService.getApiKey(userId, paramKey);
    if (!await this.apiKeyService.validateExistingKey(userId, apiKey)) {
      next("ivalid ApiKey");
    }
    //into object
    return await this.tokenService.generateToken(userId, apiKey.id, apiKey.permissions);
    //response.send();
  }

  //DELETE /{:id}
  @deleteApi('/{:id}')
  async revokeAPIKey(request: Request, response: Response) {
    //WHICH ID? 
    let id = request.params.id;
    let userId = Number(request.params.userId);//validate
    //userid is always in header
    return await this.apiKeyService.revoke(userId, "");
  }

  @getApi('tokens')
  async getTokens(request: Request, response: Response, next: NextFunction) {
    //SHOULD I TRANSFORM TO RESPONSE FORMAT HERE?
    return await this.tokenService.getTokensHistory().
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

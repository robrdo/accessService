import express, { Request, Response, Express, NextFunction } from "express";
import { ApiKeyService } from "../businessLayer/apiKeyService";
import { TokenService } from "../businessLayer/tokenService";
import { Permissions } from "../data/models/dto";
import { Controller } from "../infra/controller";
import { deleteApi } from "../infra/routeDecorators/deleteDecorator";
import { getApi } from "../infra/routeDecorators/getDecorator";
import { postApi } from "../infra/routeDecorators/postDecorator";
import HttpException from "../serviceLayer/exceptions/httpException";

export class AccessServiceController extends Controller {

  constructor(private apiKeyService: ApiKeyService,
    private tokenService: TokenService) {
    super();
    console.log('ctor');
  }

  //post
  @postApi('')
  public async createAPIkey(request: Request, response: Response): Promise<void> {
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
  public async useAPIKey(request: Request, response: Response) {
    let userId: number = Number(request.params.userId);
    //add validate if (id) undefined
    //get token from request
    let paramKey: string = "ddf";
    //put into bl //todo should i call it bl
    //?? vs ||
    let apiKey = await this.apiKeyService.getApiKey(userId, paramKey);
    await this.apiKeyService.validateExistingKey(userId, apiKey.token);
    //into object
    return await this.tokenService.generateToken(userId, apiKey.permissions).then(resolve => resolve);
    //response.send();
  }

  //DELETE /{:id}
  @deleteApi('/{:id}')
  public async revokeAPIKey(request: Request, response: Response) {
    //WHICH ID? 
    let id = request.params.id;
    let userId = Number(request.params.userId);//validate
    //userid is always in header
    return await this.apiKeyService.revoke(userId, "");
  }

  @getApi('tokens')
  public async getTokens(request: Request, response: Response, next: NextFunction) {
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

  //#region routing

  public expressRouter = express.Router();
  private _path: string = '/accessService';

  private setRoutes() {
    this.expressRouter.get(this._path, this.getTokens);
    this.expressRouter.post(this._path, this.createAPIkey);
    this.expressRouter.post(this._path + '/authentithicate', this.createAPIkey);
    this.expressRouter.delete(this._path + '/{:id}', this.createAPIkey);
  }

  //#endregion

}

/*
export class EnumHelper {
  parse<TEnum>(value : string){
/*if (value in TEnum)
  }*/
//}

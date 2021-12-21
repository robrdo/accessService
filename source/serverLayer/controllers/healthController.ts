import { getApi } from "../../infra/routing/routeDecorators/getDecorator";
import { Request, Response } from "express";
import { startUpRoute } from "../../infra/routing/routeDecorators/startUpRouteDecorator";
export default class HealthController{

constructor() {
    
}

@startUpRoute()
@getApi('')
healthCheck(request: Request, response: Response) {
    response.send(
        {
          status: 'server feels good'
        }
      );
}

}
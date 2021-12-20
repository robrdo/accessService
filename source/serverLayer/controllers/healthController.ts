import { getApi } from "../../infra/routing/routeDecorators/getDecorator";
import express, { Request, Response, Express, NextFunction } from "express";
export default class HealthController{

constructor() {
    
}

@getApi('')
healthCheck(request: Request, response: Response) {
    response.send(
        {
          status: 'server feels good'
        }
      );
}

}
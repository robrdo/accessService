import express from 'express';
import JWTService from "../../commonServices/jwtService";

export default class JwtMiddleware {
  constructor(private jwtService: JWTService) { }

  verifyToken (request: express.Request, response: express.Response, next: any) {
    let token =
      request.body.token || request.query.token || request.headers["x-access-token"];

    if (!token) {
      return response.status(403).send("A token is required for authentication");
    }
    if (this.jwtService.validateToken(token))
      return response.status(401).send("Invalid Token");
    return next();
  };  
}

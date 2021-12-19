import { NextFunction, Request, Response } from "express";

/*function acceptAccessHeaderMiddleware(request: Request, response: Response, next: NextFunction) {
    // set the CORS policy
    request.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    request.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (request.method === 'OPTIONS') {
        request.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return request.sends(200).json({});
    }
    next();
}*/
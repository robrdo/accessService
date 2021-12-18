import express, { Express } from 'express';

export class PlainAuthentithication {
    async authenticateRequest(request: express.Request, response: express.Response, next: any) {
        let req = await request.body;

        //todo: fix that
        if (req.UserId == undefined) {
            return response.send(401);
        }
        next();
    }
}
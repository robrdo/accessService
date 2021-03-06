import express from 'express';

//we need class in case real usage we would imject some service
export default class PlainAuthentithicationMiddleware {
    authenticateRequest(request: express.Request, response: express.Response, next: any) {
        let userId = request.headers.userid;
        if (!userId) {
            return response.sendStatus(401);
        }
        next();
    }
}
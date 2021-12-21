import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httpException";

function errorMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
    let httpError: HttpException = error as HttpException;
    let status = httpError ? httpError.status || 500 : 500;
    let message = error.message || 'Something went wrong';

    if (response.headersSent) {
        return next(error);
    }
    
    response
        .status(status)
        .send({
            status,
            message,
        })
}

export default errorMiddleware;
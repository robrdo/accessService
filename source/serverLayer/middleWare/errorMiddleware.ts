import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httpException";

function errorMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
    let httpError: HttpException = error as HttpException;
    //TODO: HOW TO CHECK HERE
    let status = httpError ? httpError.status || 500 : 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
            status,
            message,
        })
}

export default errorMiddleware;
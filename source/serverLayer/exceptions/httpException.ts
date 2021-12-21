export default class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string = "Something went wrong") {
        super(message);
        this.status = status;
        this.message = message;
    }
}
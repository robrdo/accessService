export class BusinessError implements Error {

    name: string;
    message: string;
    stack?: string;

    //todo:add errortype with enums to provide more readability on client
    constructor(message: string) {
        this.message = message;
    }
}

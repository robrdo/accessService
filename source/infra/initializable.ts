import { OperationCanceledException } from "typescript"

export interface Initializable {
    isInit(): boolean;
    initialize(): Promise<void>;
}

export function requireInitialize() {
    return function (target: Initializable, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.isInit()) {
            //TODO: log detailed error
            throw new Error("Method is not initialized");
        }
    }
}
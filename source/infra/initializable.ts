/**
 * use to mark classes which require init
*/
export interface Initializable {
    isInit(): boolean;
    initialize(): Promise<boolean>;
}

//*DRAFT*decorator to automatically validate isInit 
/*export function requireInitialize() {
    return function (target: Initializable, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.isInit()) {
            //TODO: log detailed error
            throw new Error("Method is not initialized");
        }
    }
}*/
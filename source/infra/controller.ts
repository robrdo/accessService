export enum RouteTypes{
    Get,
    Post,
    Update,
    Delete
}

export interface RouteDescriptor {
    method : RouteTypes,
    route : string
}

export class Controller{
    
    static routes: RouteDescriptor[] = [];

    constructor (){
        
    }
}
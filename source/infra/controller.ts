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
    
    public static routes: RouteDescriptor[] = [];

    constructor (){
        
    }
}
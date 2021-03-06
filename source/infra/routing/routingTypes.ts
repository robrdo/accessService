export enum RouteTypes {
    Get = "get",
    Post = "post",
    Put = "put",
    Delete = "delete"
}

export interface RouteDescriptor {
    method: RouteTypes,
    route: string,
    methodName: string,
    isDefault?: boolean
}
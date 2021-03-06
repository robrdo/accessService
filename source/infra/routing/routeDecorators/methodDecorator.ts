import "reflect-metadata";
import { ROUTES } from '../routingConstants';
import { RouteDescriptor, RouteTypes } from '../routingTypes';

export function decorateRoute(routeType: RouteTypes, path: string, target: any, propertyKey: string, descriptor: PropertyDescriptor, isDefaultRoute: boolean = false) {
    path = transformPath(path);
    let array = Reflect.getOwnMetadata(ROUTES, target) || [];
    let routeDescriptor: RouteDescriptor = {
        method: routeType,
        route: path.toLowerCase(),
        methodName: propertyKey,
        isDefault: isDefaultRoute
    }
    array.push(routeDescriptor);
    Reflect.defineMetadata(ROUTES, array, target);
}

function transformPath(path: string): string {
    if (!path) {
        path = '';
    }
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    return path;
}

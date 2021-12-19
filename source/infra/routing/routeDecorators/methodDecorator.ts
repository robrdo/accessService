import "reflect-metadata";
import { ROUTES } from '../routingConstants';
import { RouteDescriptor, RouteTypes } from '../routingTypes';

export function decorateRoute(routeType: RouteTypes, path: string, target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let array = Reflect.getOwnMetadata(ROUTES, target) || [];
    let routeDescriptor: RouteDescriptor = {
        method: routeType,
        route: path.toLowerCase(),
        methodInvocation: descriptor.value
    }
    array.push(routeDescriptor);
    Reflect.defineMetadata(ROUTES, array, target);
    console.log('AHTUNG! RD - ' + JSON.stringify(routeDescriptor));
    console.log('AHTUNG! ARRAY - ' + JSON.stringify(routeDescriptor));
}
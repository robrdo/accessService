import "reflect-metadata";
import { RouteDescriptor, RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function getApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {        
        decorateRoute(RouteTypes.Get, path, target, propertyKey, descriptor);
    };
}
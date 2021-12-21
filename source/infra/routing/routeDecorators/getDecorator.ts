import "reflect-metadata";
import { RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function getApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {        
        decorateRoute(RouteTypes.Get, path, target, propertyKey, descriptor);
    };
}
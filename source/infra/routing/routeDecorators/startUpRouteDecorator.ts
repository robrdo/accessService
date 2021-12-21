import "reflect-metadata";
import { RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

//simplified implementation
export function startUpRoute() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {    
        decorateRoute(RouteTypes.Get, '', target, propertyKey, descriptor, true);
    };
}
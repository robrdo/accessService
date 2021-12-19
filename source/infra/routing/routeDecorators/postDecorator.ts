import { RouteDescriptor, RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function postApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {       
        decorateRoute(RouteTypes.Post, path, target, propertyKey, descriptor);
    };
}
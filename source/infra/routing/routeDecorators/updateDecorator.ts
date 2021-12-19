import { RouteDescriptor, RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function updateApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        decorateRoute(RouteTypes.Put, path, target, propertyKey, descriptor);
    };
}
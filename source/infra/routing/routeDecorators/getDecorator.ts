import "reflect-metadata";
import { RouteDescriptor, RouteTypes } from '../routingTypes';
import { decorateRoute } from './methodDecorator';

export function getApi(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('AHTUNG!, in get');
        console.log('AHTUNG!,' + descriptor.value);
        decorateRoute(RouteTypes.Get, path, target, propertyKey, descriptor);
    };
}
import reflect, { } from 'reflect-metadata';
import { Controller, RouteDescriptor, RouteTypes } from '../controller';
import { decorateRoute } from './methodDecorator';

export function getApi(path: string) {
    return function (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('AHTUNG!, in get');
        let routeDescriptor: RouteDescriptor = {
            method: RouteTypes.Get,
            route: path
        }
        decorateRoute(routeDescriptor, target, propertyKey, descriptor);
    };
}
import { AFieldMetadata } from '../interfaces/afield.interface';
import * as _ from 'lodash';
import 'reflect-metadata';

export const AField = (options: AFieldMetadata): PropertyDecorator => {
    return (target, property) => {
        const classConstructor: any = target.constructor;
        const metadata = Reflect.getOwnMetadata('fields', classConstructor) || {};
        metadata[property] = options;
        Reflect.defineMetadata('fields', metadata, classConstructor);
    };
};
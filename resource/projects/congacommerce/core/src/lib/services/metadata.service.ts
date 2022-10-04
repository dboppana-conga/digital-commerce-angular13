import { Configuration } from '../classes/configuration.model';
import { Inject, Injectable, Injector } from '@angular/core';
import { AObject } from '../classes/index';
import { find, get, set, pickBy, split, map, forEach, isNil, defaultTo, includes, filter, some, isUndefined, isEmpty, isFunction, last, uniq, concat } from 'lodash';
import { ClassType } from 'class-transformer/ClassTransformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { ExposeMetadata } from 'class-transformer/metadata/ExposeMetadata';
import { AObjectService } from './aobject.service';

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    _reflect: any = Reflect;
    _fieldCache = {};
    types: Array<ClassType<AObject>> = [];

    constructor(@Inject('configuration') private config: Configuration, private injector: Injector) { }



    getTypeByApiName(apiName: string): ClassType<AObject> {
        const service = find(map(Array.from(get(this.injector, 'records', new Map()).values()), 'value'), (provider: any) => (typeof get(provider, 'type') === 'function') && get(provider, 'type').name === apiName);
        return get(service, 'type');
    }

    // Order CreatedBy.Name null
    getFieldName(ab: AObject | (new (t?: any) => AObject), key: any): string {
        const fieldParts = split(key, '.');
        const fieldReference = fieldParts.pop();
        let instance = (ab instanceof AObject) ? ab : new ab();
        let prefix = '';
        forEach(fieldParts, (part: any) => {
            prefix += this.getFieldName(instance, part) + '.';
            instance = this.getKeyInstance(instance, part);
        });

        const fields = this.getFieldMetadata(instance);
        return prefix + get(fields, `${fieldReference}`);
    }

    getKeyName(ab: AObject | (new (t?: any) => AObject), fieldName: string) {
        if (ab) {
            let instance;
            try {
                instance = (ab instanceof AObject) ? ab : new ab();
            } catch (e) {
                instance = ab;
            }
            const fields = this.getFieldMetadata(instance);
            let returnValue = undefined;
            for (let field in fields) {
                if (get(fields, field) === fieldName) {
                    returnValue = field;
                    break;
                }
            }
            return returnValue;
        } else
            return undefined;
    }

    getKeyInstance(type: ClassType<AObject> | AObject, fieldName: string = ''): AObject {
        const instance = (type instanceof AObject) ? new (<ClassType<AObject>>type.constructor) : new type();
        if (!isEmpty(fieldName)) {
            const metadata = this.getTypeMetadata(type, fieldName);
            if (get(metadata, 'typeFunction')) {
                const classType = metadata?.typeFunction() as (new (t?: any) => AObject);
                return new classType();
            } else if (get(instance, fieldName) instanceof AObject)
                return get(instance, fieldName);//To DO:
            else if (get(instance, `${fieldName}[0]`))
                return get(instance, `${fieldName}[0]`);
        }
        return instance;
    }

    getRestResource(type: ClassType<AObject>) {
        return defaultTo(get(this.getMetadata(type), 'route'), null);
    }

    getKeyReferenceType(type: ClassType<AObject> | AObject, fieldName: string): 'Array' | 'Object' | undefined {
        const metadata = this.getTypeMetadata(type, fieldName);
        const instance = (type instanceof AObject) ? new (<(new (t?: any) => AObject)>type.constructor) : new type();

        if (get(metadata, 'reflectedType') && Array.isArray(metadata?.reflectedType()))
            return 'Array';
        else if (Array.isArray(get(instance, fieldName)) && get(instance, `${fieldName}[0]`) instanceof AObject)
            return 'Array';
        else if (get(metadata, 'typeFunction')) {
            return 'Object';
        } else if (get(instance, fieldName) instanceof AObject) {
            return 'Object';
        } else
            return undefined;
    }
    getMetadata(aobject: AObject | (new (t?: any) => AObject)) {
        const instance = (aobject instanceof AObject) ? aobject : new aobject();
        return this._reflect.getMetadata('aobject', instance.constructor);
    }

    getTypeMetadata(aobject: ClassType<AObject> | AObject, fieldName: string) {
        const classType = (aobject instanceof AObject) ? aobject.constructor : aobject;
        if (classType)
            return defaultMetadataStorage.findTypeMetadata(classType, fieldName);
        else
            return undefined;
    }

    buildTypeModel(type: ClassType<AObject>, describe?: any): Observable<void> | Observable<any> {
        const generator = (subType: ClassType<AObject>, subDescribe?: any) => {
            const service = this.getAObjectServiceForType(subType);

            if (!isNil(service)) {
                const describe$ = isNil(subDescribe) ? service.describe() : of(subDescribe);
                return describe$
                    .pipe(
                        tap(res => {
                            // if (get(res, 'name') === new subType().getApiName()) {
                            //     const classConstructor: any = new subType().constructor;
                            //     const metadata = Reflect.getOwnMetadata('fields', classConstructor) || {};
                            //     const customFields = filter(get(res, 'fields', []), (field) =>
                            //         field.custom === true && !some(Object.values(metadata), y => lowerCase(get(y, 'soql')) === lowerCase(field.name))
                            //     );

                            //     const createProperty = (name: string, soql: string, aic?: string) => {
                            //         Object.defineProperty(subType, name, { value: null, writable: true, enumerable: true, configurable: true });
                            //         metadata[name] = { soql: soql, aic: aic };
                            //         defaultMetadataStorage.addExposeMetadata(new ExposeMetadata(subType, name, {}));
                            //     };

                            //     customFields.forEach(field => {
                            //         if (field.type === 'reference') {
                            //             const classType = this.getTypeByApiName(get(field, 'referenceTo[0]'));
                            //             if (classType) {
                            //                 createProperty(get(field, 'relationshipName'), get(field, 'relationshipName'));
                            //                 defaultMetadataStorage.addTypeMetadata({
                            //                     target: classConstructor,
                            //                     reflectedType: classType,
                            //                     propertyName: get(field, 'relationshipName'),
                            //                     typeFunction: () => classType,
                            //                     options: undefined
                            //                 });
                            //             }
                            //         }
                            //         createProperty(get(field, 'name'), get(field, 'name'));
                            //     });
                            //     Reflect.defineMetadata('fields', metadata, classConstructor);
                            // }
                            return null;
                        }),
                        catchError(() => {
                            console.warn(`Couldn't generate model for ${subType.constructor.name}`);
                            return of(null);
                        }),
                        take(1)
                    );
            } else
                return of(null);
        };

        const obsvList: Array<any> = [];
        const _loop = (instance: any) => {
            const t = instance.getType();
            if (!includes(this.types, t)) {
                obsvList.push({
                    type: t,
                    obsv: (get(instance.getMetadata(), 'dynamic') === true) ? generator(t, describe) : of(null),
                    dynamic: get(instance.getMetadata(), 'dynamic') === true
                });
                forEach(
                    filter(instance.getReferenceFields()
                        , f => !(some(obsvList, (o) => get(o, 'type') === instance.instanceOf(f).getType()))
                    ),
                    f => _loop(instance.instanceOf(f))
                );
            }
        };

        _loop(this.getKeyInstance(type));
        const dynamicList = filter(obsvList, (o: any) => o.dynamic === true);
        if (!isEmpty(dynamicList))
            return forkJoin(...map(dynamicList, 'obsv'))
                .pipe(
                    tap(() => this.types = uniq(concat(this.types, map(obsvList, 'type'))))
                );
        else
            return of();
    }

    getAObjectServiceForType(type: ClassType<AObject> | AObject, exactMatch: boolean = false): AObjectService | null {
        if (isNil(type))
            return null;
        else {
            const instance = (type instanceof AObject) ? type : (typeof type === 'function') ? new type() : type;
            let providers = map(Array.from(get(this.injector, 'records', new Map()).values()), 'value');
            if (isUndefined(providers) || isEmpty(providers))
                providers = get(this.injector, '_providers', []);
            let serviceList = filter(providers,
                (provider: any) =>
                    get(provider, 'type') === type
                    || get(provider, 'type') === type.constructor
                    || (isFunction(get(provider, 'getInstance')) && provider.getInstance() instanceof type.constructor)
                    || (get(provider, 'type') === AObject && Object.getPrototypeOf(Object.getPrototypeOf(provider)).constructor === Object));
            let typeServices = serviceList.map((service: any) => {
                const clone = Object.create(service);
                clone.setType(instance.constructor);
                return clone;
            });
            if (exactMatch && typeServices.length < 1) {
                throw `You have attempted to use a service before it has been injected: ${get(type, 'name')}`;
            } else
                return last(typeServices);
        }
    }

    getReferenceFields(type: ClassType<AObject>): Array<string> {
        const instance = new type();
        return Object.keys(this.getFieldMetadata(instance)).filter(key => this.getKeyReferenceType(type, key) === 'Array' || this.getKeyReferenceType(type, key) === 'Object');
    }

    getFieldKeys(instance: AObject): Array<string> {
        return Object.keys(this.getFieldMetadata(instance));
    }

    getFieldMetadata(aobject: AObject | ClassType<AObject>, metadataFilter?: (arg: any) => boolean) {
        const instance = (aobject instanceof AObject) ? aobject : new aobject();
        let instanceKey;
        try {
            instanceKey = instance.generatedId();
        } catch {
            instanceKey = instance.constructor.toString();
        }
        if (!get(this, '_fieldCache[instanceKey]')) {
            const _loop: any = (i: any, fieldObj = {}) => {
                const fields = Reflect.getMetadata('fields', i.constructor);
                if (fields) {
                    Object.assign(fieldObj, fields);
                    return _loop(Reflect.getPrototypeOf(i), fieldObj);
                } else {
                    return fieldObj;
                }
            };

            const returnList = _loop(instance);
            set(this, '_fieldCache[instanceKey]', returnList);
        }

        if (metadataFilter)
            return pickBy(get(this, '_fieldCache[instanceKey]'), metadataFilter);
        else
            return get(this, '_fieldCache[instanceKey]');
    }
}
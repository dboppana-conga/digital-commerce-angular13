import {
    isEmpty, isNil, keys, assign, pickBy, mapValues, mapKeys, set, get, first, split, forEach, defaultTo, isArray, isPlainObject, includes,
    join, compact, values, omit, omitBy, isEqual, identity, endsWith
} from 'lodash';
import { ClassType } from 'class-transformer/ClassTransformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { TypeMetadata } from 'class-transformer/metadata/TypeMetadata';
import { memoize } from 'lodash-decorators';
import { KeyValue } from '@angular/common';
import { Expose } from 'class-transformer';
import { ExposeMetadata } from 'class-transformer/metadata/ExposeMetadata';


export abstract class AObjectMetadata {

    generatedId(): number {
        let hashKey = Reflect.getOwnMetadata('hashKey', this.constructor);
        if (hashKey)
            return hashKey;
        else {
            const modelKey = `${JSON.stringify(Reflect.getOwnMetadata('aobject', this.constructor))}.${JSON.stringify(this)}`;
            const key = modelKey.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
            Reflect.defineMetadata('hashKey', key, this.constructor);
            return key;
        }
    }

    @memoize()
    getFieldMetadata(filter?: (arg: any) => boolean): object {
        const loop: any = (i: any, fieldObj = {}) => {
            const fields = Reflect.getMetadata('fields', i.constructor);
            if (!isEmpty(keys(fields))) {
                return loop(Reflect.getPrototypeOf(i), assign({}, fields, fieldObj));
            } else {
                return fieldObj;
            }
        };
        return (!isNil(filter)) ? pickBy(loop(this), filter) : loop(this);
    }

    @memoize()
    getFieldMetadataFromExpose(filter?: (arg: any) => boolean): object {
        const loop = (i: any, fieldObj = {}) => {
            const fields = mapValues(mapKeys(defaultMetadataStorage.getExposedMetadatas(i.constructor), (value) => value.propertyName), (o) => o.options);
            if (!isEmpty(keys(fields))) {
                return assign({}, fields, fieldObj);
            }
        };
        return (!isNil(filter)) ? pickBy(loop(this), filter) : loop(this)!;
    }

    set(key: string, value: any): void {
        set(this, `_metadata.${key}`, value);
    }

    get(key: string): any {
        return get(this, `_metadata.${key}`);
    }

    getType(): ClassType<AObject> {
        return this.constructor as ClassType<AObject>;
    }

    getMetadata(field?: string): object {
        if (!isNil(field))
            return get(Reflect.getMetadata('fields', this.constructor), field);
        else
            return Reflect.getMetadata('aobject', this.constructor);
    }

    getMetadataFromExpose(field?: string): object {
        if (!isNil(field))
            return get(mapValues(mapKeys(defaultMetadataStorage.getExposedMetadatas(this.constructor), 'propertyName'), 'options'), field);
        else
            return mapValues(mapKeys(defaultMetadataStorage.getExposedMetadatas(this.constructor), 'propertyName'), 'options');
    }

    getTypeMetadata(fieldName: string): TypeMetadata | undefined {
        if (this.constructor)
            return defaultMetadataStorage.findTypeMetadata(this.constructor, fieldName);
        else
            return undefined;
    }
    getExposeMetadata(fieldName: string): ExposeMetadata | undefined {
        if (this.constructor)
            return defaultMetadataStorage.findExposeMetadata(this.constructor, fieldName);
        else
            return undefined;
    }


    getKeys(): Array<string> {
        return keys(this.getFieldMetadataFromExpose());
    }

    getKey(apiName: string): string {
        return first(keys(this.getFieldMetadataFromExpose(f => get(f, 'name') === apiName))) as string;

    }


    instanceOf(fieldName: string): AObject {
        // 'PriceList.Account';
        const fieldParts = split(fieldName, '.');
        let instance: any;
        forEach(fieldParts, part => {
            let i = defaultTo(instance, this);

            const metadata = i.getTypeMetadata(part) as TypeMetadata;
            if (get(i, part) instanceof AObject)
                instance = get(i, part);
            else if (get(metadata, 'typeFunction')) {
                const classType = metadata.typeFunction() as ClassType<AObject>;
                instance = new classType();
            } else
                if (isArray(get(i, part)))
                    instance = first(get(i, part))!;
        });
        return defaultTo(instance, this) as AObject;
    }
    @memoize()
    getApiName(field?: string) {
        const memod = (f: any) => {
            if (!isNil(f)) {
                const fieldParts = split(f, '.');
                const fieldReference = fieldParts.pop();
                let instance: any, fields, subField;
                let prefix = '';
                forEach(fieldParts, part => {
                    prefix += (isNil(instance)
                        ? this.getApiName(part)
                        : instance.getApiName(part)) + '.';
                    instance = (isNil(instance)) ? this.instanceOf(part) : instance.instanceOf(part);
                });
                fields = instance.getFieldMetadataFromExpose();
                subField = defaultTo(get(fields, `${fieldReference}.${'name'}`), field);
                return prefix + subField;
            } else {
                return get(Reflect.getMetadata('aobject', this.constructor), 'sobjectName');
            }
        };

        return memod(field);
    }


    strip(fields?: Array<string>): AObject {
        let standardFields = ['CreatedDate', 'ModifiedDate', 'ModifiedBy', 'CreatedBy', '_metadata'];
        if (fields) standardFields = standardFields.concat(fields);
        return omit(pickBy(this, (a, b) => identity(a) && !(endsWith(b, 'Id') && !isEqual(b, 'Id') && b !== 'ExternalId') && b !== 'hasErrors'), standardFields) as unknown as AObject;
    }

    getReferenceFields(type?: 'Child' | 'Lookup'): Array<string> {
        if (!isNil(type)) {
            return Object.keys(this.getFieldMetadata()).filter(key => this.getReferenceType(key) === type);
        } else {
            return Object.keys(this.getFieldMetadata()).filter(key => this.getReferenceType(key) === 'Child' || this.getReferenceType(key) === 'Lookup');
        }
    }
    getReferenceFieldsFromExpose(type?: 'Child' | 'Lookup'): Array<string> {
        if (!isNil(type)) {
            return Object.keys(this.getFieldMetadataFromExpose()).filter(key => this.getReferenceType(key) === type);
        } else {
            return Object.keys(this.getFieldMetadataFromExpose()).filter(key => this.getReferenceType(key) === 'Child' || this.getReferenceType(key) === 'Lookup');
        }
    }

    getReferenceType(fieldName: string): 'Lookup' | 'Child' | undefined {
        const metadata = this.getTypeMetadata(fieldName) as TypeMetadata;

        if (get(metadata, 'reflectedType') && new metadata.reflectedType() instanceof AObject === false && Array.isArray(metadata.reflectedType()))
            return 'Child';
        else if (Array.isArray(get(this, fieldName)) && get(this, `${fieldName}[0]`) instanceof AObject)
            return 'Child';
        else if (get(metadata, 'typeFunction')) {
            return 'Lookup';
        } else if (get(this, fieldName) instanceof AObject) {
            return 'Lookup';
        } else
            return undefined;
    }

    toApiJson(platform: 'Salesforce' | 'AIC' = 'Salesforce') {
        const fieldMap = this.getFieldMetadata((metadata) => !isNil(metadata.soql));
        const fieldMapKeys = Object.keys(fieldMap);
        const untyped = {

        };
        const suffix = platform === 'Salesforce' ? 'soql' : 'aql';
        const referenceKeys = this.getReferenceFields();
        const currencyKeys = ['DefaultCurrencyIsoCode', 'CurrencyIsoCode', 'CountryCode', 'StateCode'];
        forEach(fieldMapKeys, fieldKey => {
            if (!isPlainObject(get(this, fieldKey)) && !includes(referenceKeys, fieldKey) && !includes(currencyKeys, fieldKey)) {
                if (isArray(get(this, fieldKey)))
                    set(untyped, get(fieldMap, `${fieldKey}.${suffix}`), join(get(this, fieldKey), ';'));
                else
                    set(untyped, get(fieldMap, `${fieldKey}.${suffix}`), get(this, fieldKey));
            }
        });
        return untyped;
    }

    toApiJsonFromExpose(platform: 'Salesforce' | 'AIC' = 'Salesforce') {
        const fieldMap = this.getFieldMetadataFromExpose((metadata) => !isNil(metadata.name));
        const fieldMapKeys = Object.keys(fieldMap);
        const untyped = {
        };
        const suffix = 'name';
        const referenceKeys = this.getReferenceFieldsFromExpose();
        const currencyKeys = ['DefaultCurrencyIsoCode', 'CurrencyIsoCode', 'CountryCode', 'StateCode'];
        forEach(fieldMapKeys, fieldKey => {
            if (!isPlainObject(get(this, fieldKey)) && !includes(referenceKeys, fieldKey) && !includes(currencyKeys, fieldKey)) {
                set(untyped, get(fieldMap, `${fieldKey}.${suffix}`), get(this, `${fieldKey}`));
            }
        });
        return untyped;
    }

    get errors(): Array<AObjectError> {
        this.validate();
        return compact(values(this.get('error')));
    }

    set errors(e: Array<AObjectError>) { }

    get hasErrors(): boolean {
        return get(this.errors, 'length', 0) > 0;
    }

    set hasErrors(e: boolean) { }

    setError(key: string, param?: object, type: 'error' | 'warning' | 'info' = 'error', children?: Array<AObjectError>, reference?: KeyValue<string, string>): void {
        this.set(`error['${key}']`, new AObjectError(key, param, type, children, reference));
    }
    clearError(key?: string): void {
        if (!isNil(key))
            this.set(`error['${key}']`, null);
        else
            this.set(`error`, null);
    }

    abstract validate(): void;
}

export class AObject extends AObjectMetadata {

    @Expose({ name: 'Id' })
    Id: string | null = null;


    @Expose({ name: 'CreatedDate' })
    CreatedDate: Date | null = null;

    @Expose({ name: 'ModifiedDate' })
    ModifiedDate: Date | null = null;


    @Expose({ name: 'LastModifiedById' })
    LastModifiedById: string | null = null;


    @Expose({ name: 'CreatedById' })
    CreatedById: string  | null= null;

    _metadata?: any;
    validate(): void { }
}

export enum FilterOperator {
    // TODO: Add filter operators as supported by RLP APIs.
    EQUAL = 'eq',
    NOT_EQUAL = 'noteq',
    IN = 'in',
    LESS_THAN = 'lt',
    LESS_EQUAL = 'le',
    GREATER_THAN = 'gt',
    GREATER_EQUAL = 'ge',
    LIKE = 'like',
    NotEqual = 'noteq'
}

export class AObjectError extends Error {
    constructor(m: string, public parameter?: Object, public type: 'error' | 'warning' | 'info' = 'error', public children?: Array<AObjectError>, public reference?: KeyValue<string, string>) {
        super(m);
        this.children = compact(this.children);
        if (!isNil(parameter) && !isPlainObject(parameter)) {
            throw new Error('Error parameter must be of type plain object or null');
        }
    }
}



export enum Operator {
    EQUAL = "Equal",
    NOT_EQUAL = "NotEqual",
    IN = "In",
    NOT_IN = "NotIn",
    LESS_THAN = "LessThan",
    LESS_EQUAL = "LessEqual",
    GREATER_THAN = "GreaterThan",
    GREATER_EQUAL = "GreaterEqual",
    LIKE = "Like",
}
import { ATableMetadata } from '../interfaces/atable.interface';
import { AObject } from '../classes/a.model';


export function ATable(metadata: ATableMetadata) {
    return function (target) {
        Reflect.defineMetadata('aobject', metadata, target);
    };
}

export function ATableType(objectType: new (t?) => AObject){
    return function (target){
        target.type = objectType;
    };
}
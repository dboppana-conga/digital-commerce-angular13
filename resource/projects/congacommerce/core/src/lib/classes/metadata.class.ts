export class Metadata{
    Id: string = null;
    Name: string = null;
    Label: string = null;
    Description: string = null;
    Fields: Array<MetadataField> = [new MetadataField()];
}

export class MetadataField{
    type: string = null;
    label: string = null;
    length: number = 0;
    defaultValue: any;
    name: string;
    picklistValues: Array<Picklist> = [new Picklist()];
}

export class Picklist{
    label: string = null;
    value: string = null;
}


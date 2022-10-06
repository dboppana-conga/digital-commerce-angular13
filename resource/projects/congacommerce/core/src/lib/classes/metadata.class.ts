export class Metadata{
    Id: string | null = null;
    Name: string | null = null;
    Label: string | null = null;
    Description: string | null = null;
    Fields: Array<MetadataField> = [new MetadataField()];
}

export class MetadataField{
    type: string | null = null;
    label: string | null = null;
    length: number = 0;
    defaultValue: any;
    name: string | null = null;
    picklistValues: Array<Picklist> = [new Picklist()];
}

export class Picklist{
    label: string | null = null;
    value: string | null = null;
}


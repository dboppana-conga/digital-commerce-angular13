import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AObject, MetadataService, Operator, AObjectService, FilterOperator } from '@congacommerce/core';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as _ from 'lodash';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { LookupOptions } from '../../../shared/interfaces';
import { FieldFilter } from '@congacommerce/ecommerce';
/**
 * <strong> This component is a work in progress</strong>
 * The data filter component allows users to set multiple filters for a single object type within a single UI component.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/filter.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
```typescript
import { DataFilterModule } from '@congacommerce/elements';

@NgModule({
  imports: [DataFilterModule, ...]
})
export class AppModule {}
```
* @example
* // Basic usage.
```typescript
* <apt-data-filter
*             [type]="aObjectType"
*             (filterListChange)="handleFilterListChange()"></apt-data-filter>
```
* // Initialize with array of default filters.
```typescript
* <apt-data-filter
*             [type]="aObjectType"
*             [filterList]="defaultFilters"
*             (filterListChange)="handleFilterListChange()"></apt-data-filter>
```
*/
@Component({
  selector: 'apt-data-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class DataFilterComponent implements OnInit {
  /**
   * The AObject class type to filter.
   */
  @Input() type: ClassType<AObject>;

  /**
   * List of default filters to initialize the component with.
   */
  @Input() filterList: Array<FieldFilter>;
  /**
   * List of default custom filters to initialize the component with.
   */
  @Input() customfilter: Array<CustomFilterView>;

  /**
   * Addition input options
   */
  @Input() filterOptions: FilterOptions;

  /**
   * Event emitter for when the filter list values change.
   */
  @Output() filterListChange: EventEmitter<Array<FieldFilter>> = new EventEmitter<Array<FieldFilter>>();

  /** @ignore */
  @ViewChild('dropdown', { static: false }) dropdown: BsDropdownDirective;
  /** @ignore */
  instance: AObject;
  /** @ignore */
  view$: Observable<FilterView>;
  /** @ignore */
  operatorMap = {
    Equal: '=',
    NotEqual: '!=',
    GreaterThan: '>',
    LessThan: '<',
    GreaterEqual: '>=',
    LessEqual: '<='
  };

  expressionOperator: 'AND' | 'OR' = 'AND';
 
  constructor(private metadataService: MetadataService) { }

  ngOnInit() {
    this.instance = new this.type();

    // Determine the aobject service for the input type
    const service = this.metadataService.getAObjectServiceForType(this.type, true);
    this.view$ = service.describe(this.type)
      .pipe(
        map(metadata => {
          // Get the list of field labels
          let fieldList: Array<Field> = this.getFieldOptions(
            !_.isEmpty(_.get(this.filterOptions, 'visibleFieldsWithOperators'))
              ? _.map(_.get(this.filterOptions, 'visibleFieldsWithOperators'), (fieldOp: FieldWithOperators) => fieldOp.field)
              : _.get(this.filterOptions, 'visibleFields'),
            _.get(metadata, 'FieldMetadata'),
            this.instance
          );

          if (this.customfilter && this.customfilter.length > 0) {
            fieldList = fieldList.concat(this.getCustomFields());
          }
          return {
            fieldList: _.sortBy(fieldList, 'label'),
            conditionList: _.map(_.flatten(_.map(_.get(this, 'filterList'), 'conditions')), c => new ConditionView(c, fieldList)),
            appliedConditions: _.map(_.flatten(_.map(_.get(this, 'filterList'), 'conditions')), c => new ConditionView(c, fieldList)),
            operatorList: _.get(this.filterOptions, 'visibleOperators', _.values(Operator)),
            fieldListWithOperators: this.getFieldListWithOperators(_.get(this.filterOptions, 'visibleFieldsWithOperators'))
          } as FilterView;
        })
      );
  }
  /** @ignore */
  addCriteria(view: FilterView) {
    if (_.isNil(_.get(this, 'filterList')))
      _.set(this, 'filterList', new Array<FieldFilter>());
    view.conditionList.push(new ConditionView(new FilterCondition(this.type, null), view.fieldList));
  }
  /** @ignore */
  removeCriteria(conditionView: ConditionView, view: FilterView) {
    _.remove(view.conditionList, conditionView);
  }
  /** @ignore */
  deleteCriteria(conditionView: ConditionView, view: FilterView) {
    _.remove(view.conditionList, conditionView);
    _.remove(view.appliedConditions, conditionView);
    _.remove(this.filterList, (obj) => _.first(_.split(obj.field, '.')) === _.get(conditionView.condition, 'field'))
    this.filterListChange.emit(this.filterList);
  }
  /** @ignore */
  handleApply($event: any, view: FilterView) {
    this.filterList = [];
    let filterData = [];
    view.appliedConditions = _.slice(view.conditionList);
    _.forEach(view.appliedConditions, (elem) => {
      const payload: FieldFilter = {
        'field': _.get(elem.val, 'referenceType') ? `${_.get(elem.condition, 'field')}.Id` : _.get(elem.condition, 'field'),
        'filterOperator': _.get(FilterOperator, _.findKey(Operator, (value) => value === _.get(elem.condition, 'filterOperator'))),
        'value': _.get(elem.condition, 'value')
      }
      filterData.push(payload);
    });
    this.filterListChange.emit(filterData);
    this.dropdown.hide();
  }
  /** @ignore */
  handleDropdownHide(view: FilterView) {
    view.conditionList = _.slice(view.appliedConditions);
    this.dropdown.hide();
  }

  /** @ignore */
  changeValue(value: any, condition: FilterCondition, field: Field) {
    if (field.execute) {
      value = field.execute(value, condition);
    }
    condition.setValue(value);
  }
  /**@ignore */
  changeField(field: Field, condition: any) {
    condition.field = field.value;
  }

  /** @ignore */
  getFieldListWithOperators(visibleFieldsWithOperators: Array<FieldWithOperators>): Object {
    if (!_.isEmpty(visibleFieldsWithOperators)) {
      let returnOb = {};
      _.forEach(visibleFieldsWithOperators, (fieldAndOp: FieldWithOperators) => {
        returnOb[fieldAndOp.field] = fieldAndOp.operators;
      });
      return returnOb;
    }
    return null;
  }
  /** @ignore */
  private getFieldOptions(visibleFields: Array<string>, fieldMetadata: any, instance: AObject): Array<Field> {
    // Get the list of field labels
    const fieldList: Array<Field> = new Array<Field>();
    _.forEach(fieldMetadata, field => {
      let referenceType: AObjectService;
      if (!_.isNil(_.get(field, 'LookupObjectName')))
        referenceType = _.get(field, 'LookupObjectName');
      const key = instance.getKey(_.get(field, 'FieldName'));

      if (!_.isNil(key) && (_.includes(visibleFields, key) || _.isNil(visibleFields)))
        fieldList.push({
          value: key,
          label: _.get(field, 'DisplayName') ? _.get(field, 'DisplayName') : _.get(field, 'FieldName'),
          referenceType: referenceType
        });
    });
    return fieldList;
  }


  private getCustomFields() {
    const fieldList: Array<Field> = new Array<Field>();
    _.forEach(this.customfilter, field => {
      const min = _.get(field, 'minVal');
      const obj = {
        value: _.get(field, 'mapApiField'),
        label: _.get(field, 'label'),
        type: _.get(field, 'type'),
        execute: _.get(field, 'execute'),
        referenceType: _.get(field, 'isLookup'),
      };
      if (min) _.set(obj, 'min', min);
      fieldList.push(obj)
    });
    return fieldList;
  }

}

/** @ignore */
interface FilterView {
  fieldList: Array<Field>;
  conditionList?: Array<ConditionView>;
  appliedConditions?: Array<ConditionView>;
  operatorList: Array<Operator>;
  fieldListWithOperators: Object;
}

/** @ignore */
interface Field {
  value: string;
  label: string;
  type?: 'double' | 'string' | 'date';
  referenceType?: AObjectService;
  min?: number;
  execute?: Function;
}


/** @ignore */
class ConditionView {
  get label(): string {
    const displayField = _.find(this.fieldLabels, { value: _.get(this.condition, 'field') });
    return _.defaultTo(_.get(displayField, 'label'), _.get(this.condition, 'field'));
  }

  get value(): string {
    return _.get(this, '_value', _.get(this.condition, 'val'));
  }

  get operator(): string {
    return _.get(this.operatorMap, _.get(this.condition, 'filterOperator'), _.get(this.condition, 'filterOperator'));
  }

  operatorMap = {
    Equal: '=',
    NotEqual: '!=',
    GreaterThan: '>',
    LessThan: '<',
    GreaterEqual: '>=',
    LessEqual: '<='
  };

  lookupOptions: LookupOptions = {
    primaryTextField: 'Name',
    onLookupChange: (record) => {
      this._value = _.get(record, 'Name');
    }
  };


  private _value: string;

  public val: Field = null;

  constructor(public condition: any, private fieldLabels?: Array<Field>) {
    // Set the _value field on reference type fields that are reference types with preset values.
    // if (_.get(_.find(this.fieldLabels, { value: _.get(this.condition, 'field') }), 'Lookup')) {
    //   _.get(_.find(this.fieldLabels, { value: _.get(this.condition, 'field') }), 'Lookup').get([_.get(this.condition, 'val')])
    //     .pipe(take(1)).subscribe(record => this._value = _.get(_.first(record), 'Name'));
    // }
  }

}

/**
 * Type used to describe the custom filter options in the filter component.
 */
export interface CustomFilterView {
  /** The custom field label to be displayed under the filter display dropdown. */
  label: string;
  /** The api field of the custom field to be mapped with when querying. */
  mapApiField: string;
  /** The type of the custom field  */
  type: 'double' | 'string' | 'date';
  /** Set minimum value when input type is 'double'. The default minimum value is 1. */
  minVal?: number;
  /** Method to bind the custom logic on custom field. */
  execute: Function;
}
/**
 * Type used to describe the configuration options input for the filter component.
 */
export interface FilterOptions {
  /**
   * Array of fields to be visible to the filter.
   */
  visibleFields?: Array<string>;
  /**
   * Array of type 'Operator' to be used as the filter operators.
   */
  visibleOperators?: Array<Operator>;
  /**
   * Array of fields and their dependent operators.
   */
  visibleFieldsWithOperators?: Array<FieldWithOperators>;
}

/**
 * Field name with an associated list of operators.
 */
export interface FieldWithOperators {
  /**
   * Field name.
   */
  field: string;
  /**
   * Array of operators to use with this field.
   */
  operators: Array<Operator>;
}

class FilterCondition {
  value: string;
  setValue(val: any) {
    if (val instanceof Array) {
      this.value = _.join(val, ',');
    }
    else if (val instanceof Date) {
      this.value = val.toISOString();
    }
    else if (val instanceof Object) {
      this.value = val.Id;
    }
    else {
      this.value = val;
    }
  }
  constructor(public type: ClassType<AObject>, public val: any) {
    this.setValue(val);
  }

}

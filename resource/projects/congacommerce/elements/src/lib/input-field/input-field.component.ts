import {
  Component,
  Input,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, take, flatMap, catchError } from 'rxjs/operators';
import {
  forEach,
  get,
  isEmpty,
  isNil,
  assign,
  remove,
  defaultTo,
  find,
  lowerCase,
  pick,
} from 'lodash';
import * as moment from 'moment';
import {
  AObjectService,
  AObject,
  MetadataService,
  ApiService,
} from '@congacommerce/core';
import { LookupOptions } from '../../shared/interfaces/lookup-option.interface';

/** @ignore */
const _moment = moment;

/**
 * The Input field component displays the field values as a radio button, checkbox, dropdown, a text area or a label value, depending upon the field type.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/input-field.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { InputFieldModule } from '@congacommerce/elements';

@NgModule({
  imports: [InputFieldModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic Usage
 ```typescript
* <apt-input-field
*             [(ngModel)]="myModel"
*             [field]="fieldApiName"
*             [entity]="entityApiName"
* ></apt-input-field>
 ```
*
* // All inputs and outputs
 ```typescript
* <apt-input-field
*             [(ngModel)]="myModel"
*             (ngModelChange)="handleChange($event)"
*             [field]="fieldApiName"
*             [entity]="entityApiName"
*             [label]="label"
*             [readonly]="isReadOnly"
*             [allowEmpty]="allowEmpty"
*             [disabledValues]="disabledValues"
*             [hiddenValues]="hiddenValues"
*             [inline]="isInline"
*             [small]="isSmall"
*             [rows]="2"
*             [placeholder]="myPlaceholder"
*             [required]="true"
*             [errorMsg]="errorMessage"
*             [showLabel]="true"
*             [labelClass]="labelClass"
*             [filterValues]="filterValues"
*             [hideOptions]="true"
*             [hide]="true"
*             [defaultValue]="true"
*             [enableValues]="values"
*             [lookupOptions]="lookupOptions"
* ></apt-input-field>
 ```
*/
@Component({
  selector: 'apt-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent
  implements ControlValueAccessor, OnChanges, OnDestroy {
  /**
   * Property to show error message
   */
  @Input() errorMsg: string;
  /**
   * Field property of the model class
   */
  @Input() field: string;
  /**
   * The model class
   */
  @Input() entity: AObject;
  /**
   * Label to be shown on this input.
   */
  @Input() showLabel: boolean = true;
  /**
   * Label override
   */
  @Input() label: string;
  /**
   * Flag to set this input as read only.
   */
  @Input() readonly: boolean = false;
  /**
   * Flag to allow this input to be empty.
   */
  @Input() allowEmpty: boolean = false;
  /**
   * Set of disabled values.
   */
  @Input() disabledValues: Set<string> = new Set<string>();
  /**
   * Set of hidden values.
   */
  @Input() hiddenValues: Set<string> = new Set<string>();
  /**
   * Flag to set this input as inline.
   */
  @Input() inline: boolean = false;
  /**
   * Flag to set this element as a small input.
   */
  @Input() small: boolean = false;
  /**
   * rows override for textarea
   */
  @Input() rows: number = 3;
  /**
   * Placeholder string for the input.
   */
  @Input() placeholder: string = '';
  /**
   * Flag to set this input as required.
   */
  @Input() required: boolean;
  /**
   * String of bootstrap classes to ovverride the default styling of input field label.
   */
  @Input() labelClass: string;
  /**
   * Array of string of values to be available in picklist
   */
  @Input() filterValues: Array<string>;
  /**
   * Array of ComplexArray type as picklist values
   */
  @Input() picklistValues: Array<ComplexArray>;
  /**
   *  String type name of the lookupObject to be fetched.
   */
  @Input() lookupObjectName: string;
  /**
   * Boolean value to show default picklist values or not.
   */
  @Input() hideOptions: boolean = false;
  /**
   *  Boolean value to show or hide the component.
   */
  @Input() hide: boolean = false;
  /**
   *  set minimum value for the number field of type 'double'.
   */
  @Input() minVal: number = 1;
  /**
   * Boolean value when set to true will populate the incoming field with Salesforce's default value
   */
  @Input() defaultValue: boolean;
  /**
   * List of enabled values.
   */
  @Input() enableValues: Array<string>;
  /**
   * Object to set primary text field, secondary text field, thumbnail field, conditions, filters etc
   */
  @Input() lookupOptions: LookupOptions;
  /**
   * Flag to set the picklist to a multipicklist
   */
  @Input() multiple: boolean = false;
  /**
   * Flag to show the asterisk on a field.
   */
  @Input() asterisk: boolean = true;
  /**
   * Type to be passed to render the corresponding input field.
   */
  @Input() fieldType: string;
  /**
   * Type to be passed to render the corresponding input field.
   */
  @Input() displayFieldType: 'radio' | 'checkbox';

  /** @ignore */
  disabled: boolean = false;
  /** @ignore */
  value: any = null;
  /** @ignore */
  uuid: string;
  /** @ignore */
  emptyLabel: string;
  /** @ignore */
  view$: BehaviorSubject<InputView> = new BehaviorSubject<InputView>(null);
  /** @ignore */
  options$: Observable<Array<PicklistValue>>;
  /** @ignore */
  options: Array<PicklistValue>;
  /** @ignore */
  loading = false;
  /** @ignore */
  timeout;
  /** @ignore */
  lookupId: string = null;
  /**
   * Current subscriptions in this class.
   * @ignore
   */
  private subs: Array<any> = [];

  constructor(
    private translateService: TranslateService,
    private aobjectService: AObjectService,
    private cdr: ChangeDetectorRef,
    private metadataService: MetadataService,
    private apiService: ApiService
  ) { }

  ngOnChanges() {
    if (!this.entity || !this.field)
      throw 'Entity and field name are required for input-field component';
    else {
      let view: InputView = {
        metadata: null,
        lookupResults: null,
      };
      if (this.fieldType) {
        view.metadata = {
          DataType: this.fieldType.toLowerCase(),
          picklistValues: this.picklistValues,
          LookupObjectName: this.lookupObjectName,
        };
        this.view$.next(view);
      } else {
        this.subs.push(
          this.aobjectService
            .describe(this.getEntityType(), this.field)
            .subscribe((metadata) => {
              view.metadata = metadata;
              this.view$.next(view);
              if (!isNil(this.value)) this.setLookupFieldData();
            })
        );
      }
    }
    this.uuid = this.aobjectService.guid();
    this.setOptions();
    this.translateService.stream('COMMON.EMPTY').subscribe((value: string) => {
      this.emptyLabel = value;
    });

    if (this.defaultValue === true) this.setInitialValue();
  }
  /** @ignore */
  onTouched = () => { };
  /** @ignore */
  getEntityType() {
    return this.entity instanceof AObject ? this.entity.getType() : this.entity;
  }
  /** @ignore */
  onLookupSearch(data) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setLookupFieldData(get(data, 'term'));
    }, 500);
  }
  /** @ignore */
  setLookupFieldData(query: string = '') {
    this.subs.push(
      this.view$
        .pipe(
          take(1),
          filter((view) => {
            const type = lowerCase(get(view, 'metadata.DataType'));
            return type === 'reference' || type === 'lookup';
          }),
          flatMap((view) => {
            this.loading = true;
            const objectName = get(view, 'metadata.LookupObjectName');
            const keyType = !isNil(get(this.entity, objectName)) ? get(this.entity, objectName) : this.metadataService.getTypeByApiName(objectName);
            const service: AObjectService = this.metadataService.getAObjectServiceForType(keyType);

            // const payload = {
            //   "ObjectName": objectName,
            //   "Limit": 10
            // }
            this.lookupOptions = assign(
              {
                secondaryTextField: '',
                thumbnailField: '',
                primaryTextField: 'Name',
                conditions: null,
                expressionOperator: 'AND',
                filters: null,
                fieldList: ['Name', 'Id'],
                sortOrder: null,
                page: 10, //new APageInfo(10)
              },
              this.lookupOptions
            );
            this.lookupOptions.searchString = query;
            let queryparam = new URLSearchParams();
            query && queryparam.append('criteria', `Name.Contains('${query}')`);
            const params = isEmpty(queryparam.toString())
              ? ''
              : `&${queryparam.toString()}`;
            const relativePath = this.metadataService.getRestResource(keyType);
            let obsv$ = this.apiService.get(`${relativePath}?${params}`);
            // let obsv$ = this.apiService.get(`data/v1/query/${objectName}`)
            // TO DO:  service.query(omit(this.lookupOptions, ['primaryTextField', 'secondaryTextField', 'thumbnailField']));

            let recordObsv$: Observable<AObject> = of(null);
            if (!isNil(this.value)) recordObsv$ = of(null); // service.fetch(this.value);

            combineLatest(obsv$, recordObsv$)
              .pipe(take(1))
              .subscribe(([results, record]) => {
                this.loading = false;
                if (!isNil(record) && !isEmpty(results))
                  results.unshift(record);

                view.lookupResults = results;
                this.cdr.markForCheck();
              });
            return of(view);
          }),
          catchError(() => {
            this.loading = false;
            return of(null);
          })
        )
        .subscribe((myView) => {
          this.view$.next(myView);
        })
    );
  }

  /**
   * Adds the field values to be displayed, to an object with key value properties. The field would be a read only if the disabled property is set to true.
   * @returns an array of picklist objects with label, value and disabled properties.
   * @ignore
   */
  setOptions(): void {
    this.subs.push(
      this.view$
        .pipe(
          map((view) => {
            const options = new Array<PicklistValue>();
            forEach(get(view, 'metadata.picklistValues', []), (option) => {
              if (
                (!get(this.hiddenValues, 'has') ||
                  !this.hiddenValues.has(option.value)) &&
                option.active !== false
              ) {
                // Picklist values to be popoulated in the dropdown.
                this.placeholder = 'None';
                if (get(this.filterValues, 'length') > 0) {
                  if (this.filterValues.find((r) => r === option.value)) {
                    options.push({
                      label: option.DisplayText,
                      value: option.Value,
                      disabled:
                        this.disabledValues && this.disabledValues.has
                          ? this.disabledValues.has(option.value)
                          : false,
                    });
                  }
                } else if (!this.hideOptions) {
                  options.push({
                    label: option.DisplayText || option.Key,
                    value: option.Value,
                    disabled:
                      this.disabledValues && this.disabledValues.has
                        ? this.disabledValues.has(option.value)
                        : false,
                  });
                }
              }
            });
            if (this.allowEmpty)
              options.unshift({
                label: this.emptyLabel,
                value: null,
                disabled: false,
              });
            return options;
          })
        )
        .subscribe((metadata) => {
          this.options = metadata;
          this.cdr.markForCheck();
        })
    );
  }
  /** @ignore */
  setInitialValue() {
    if (isNil(this.value)) {
      this.view$.pipe(take(1)).subscribe((view) => {
        this.writeValue(get(view, 'metadata.DefaultValue'));
      });
    }
  }

  /**
   * Sets the field value to null or its default.
   * @param field value.
   * @ignore
   */
  writeValue(value: any = null) {
    this.lookupId = typeof (value) === 'object' ? get(value, 'Id') : value;
    if (value !== this.value) {
      this.value = value;
      this.setLookupFieldData();
      this.propagateChange(this.value);
    }
  }
  /**
   * @ignore
   */
  // tslint:disable-next-line:no-shadowed-variable
  propagateChange = (_: any) => { };
  /** @ignore */
  registerOnChange(fn: (_: any) => {}): void {
    this.propagateChange = fn;
  }
  /** @ignore */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
  /** @ignore */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
  /** @ignore */
  onBooleanChange(value) {
    this.propagateChange(value);
  }
  /** @ignore */
  onCurrencyChange(value) {
    this.propagateChange(value);
  }
  /**
   * Sets the field value to the selected checbox value.
   *
   * @param data check box value selected by user.
   * @ignore
   */
  onMultiChange(data) {
    if (!this.value && data) {
      this.value = data;
    } else if (this.value.indexOf(data) === -1) {
      this.value += `;${data}`;
    } else {
      this.value = remove(this.value.split(';'), function (n) {
        return n !== data;
      }).join(';');
    }
    if (isEmpty(this.value)) this.value = null;
    this.propagateChange(this.value);
  }

  onPickChange(data) {
    if (!this.value && data) {
      this.value = data;
    } else if (isEmpty(this.value)) this.value = null;
    this.propagateChange(this.value);
  }

  /** 
   * @ignore
   */
  onLookupChange(value: string, lookupResults: Array<any>) {
    if (get(this, 'lookupOptions.onLookupChange')) {
      this.lookupOptions.onLookupChange(find(lookupResults, { Id: value }));
    }
    value = find(lookupResults, { Id: value });
    this.propagateChange(value);
  }

  /** @ignore */
  getsetValue(val) {
    if (defaultTo(this.value) && this.value.indexOf(val) > -1) {
      return {
        value: true,
      };
    } else {
      return {
        val: false,
      };
    }
  }
  /**
   * Sets the field value to the selected date value.
   * @ignore
   */
  onDateChange(value: Date) {
    this.writeValue(_moment(value).format('YYYY-MM-DD'));
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
/** @ignore */
interface PicklistValue {
  label: string;
  value: string;
  disabled: boolean;
}

/** @ignore */
interface InputView {
  metadata: any;
  lookupResults: Array<any>;
}

interface ComplexArray {
  Key: string;
  Value: string;
  Sequence: boolean;
}

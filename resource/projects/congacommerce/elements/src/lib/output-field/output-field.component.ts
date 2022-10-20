import { Component, Input, OnChanges, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AObject, AObjectService } from '@congacommerce/core';
import { isNil, get, find, first, split, last, map, defaultTo, set, lowerCase, includes, clone } from 'lodash';
import { BehaviorSubject, Subscription, combineLatest, of } from 'rxjs';
import { map as rmap, switchMap } from 'rxjs/operators';
import { ClassType } from 'class-transformer/ClassTransformer';
import { MetadataService } from '@congacommerce/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { LookupOptions } from '../../shared/interfaces/lookup-option.interface';
/**
 * Output field component is used to create a label value paired output that can be displayed as an editable field with an optional popover that shows related information about the field.
 * <h3>Preview</h3>
 *  <div>
 *    <h4>1.) Output field</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/outputField.PNG" style="max-width: 100%">
 *    <h4>2.) Output field displayed as an editable field with popover</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/outputFieldWithEditableField.PNG" style="max-width: 100%">
 *  </div>
 * <h3>Usage</h3>
 *
 ```typescript
import { OutputFieldModule } from '@congacommerce/elements';

@ngModule({
  imports: [OutputFieldModule, ...]
})
 ```
 * @example
 ```typescript
 * <apt-output-field
 *              [record]="quote"
 *              [field]="CreatedDate"
 *              layout="inline"
 *              [editable]="false"
 * ></apt-output-field>
 ```
 */
@Component({
  selector: 'apt-output-field',
  templateUrl: './output-field.component.html',
  styleUrls: ['./output-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputFieldComponent implements OnChanges, OnDestroy {
  /**
   * field property of the model class
   */
  @Input() field: string;

  /**
   * An instance of an object
   */
  @Input() record: AObject;

  /**
   * The layout for the displayed label and value
   */
  @Input() layout: 'stacked' | 'inline' = 'stacked';

  /**
   * Format option passed into the date pipe used for date fields
   */
  @Input() dateFormat: string;

  /**
   * the field property to use to render the value for lookup datatype
   */
  @Input() displayValue: string;

  /**
   * Label string override
   */
  @Input() label: string;

  /**
   * Use default value of value is undefined
   */
  @Input() default: boolean = false;

  /**
   * Flag to display only field label
   */
  @Input() labelOnly: boolean = false;

  /**
   * String of bootstrap classes for additional styling on output field label
   */
  @Input() labelClass: string;

  /**
   * String of bootstrap classes for additional styling on output field value
   */
  @Input() valueClass: string;

  /**
   * Flag to set this field as editable.
   */
  @Input() editable: boolean = true;

  /**
   * Flag to show the quick view lookup popover for this field.
   */
  @Input() showQuickView: boolean = false;

  /**
   * Flag to show only value for this field without any label.
   */
  @Input() valueOnly: boolean = false;

  /**
  * Object to set primary text field, secondary text field, thumbnail field, conditions, filters etc.
  */
  @Input() lookupOptions: LookupOptions;

  /**
   * Flag to set this input as required.
   */
  @Input() required: boolean;

  /**
   * Maximum number of characters to show on string type fields.
   */
  @Input() maxCharacterLength: number;

  /**
   * The target for the inline edit popover.
   * @ignore
   */
  @ViewChild('pop') pop: PopoverDirective;

  /**
   * The target for the lookup popover.
   * @ignore
   */
  @ViewChild('lookupPop') lookupPop: any;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Stores the timeout key for the timeout associated with showing the lookup popover.
   * @ignore
   */
  showTimeout: any;

  /**
   * Stores the timeout key for the timeout associated with hiding the lookup popover.
   * @ignore
   */
  hideTimeout: any;

  /**
   * Flag to set the popover to its expanded state.
   * @ignore
   */
  expanded: boolean = false;

  /**
   * Flag to check if mouse is hovering over lookup popover expand button.
   * @ignore
   */
  hovering: boolean = false;

  /**
   * Flag to check if the update is loading for the update button in the edit field popover.
   * @ignore
   */
  loading: boolean = false;
  /**
   * Used to hold information for rendering the view.
   * @ignore
   */
  view$: BehaviorSubject<OutputFieldView> = new BehaviorSubject<OutputFieldView>(null);
  /** @ignore */
  subscription: Subscription;
  /** @ignore */
  supportedObjectRoutes = ['order', 'proposal', 'product', 'cart', 'asset'];

  constructor(private aobjectService: AObjectService, private elRef: ElementRef, private metadataService: MetadataService) { }
  ngOnChanges() {
    this.ngOnDestroy();
    if (this.required && isNil(get(this.record, this.field))) {
      this.record.setError('DETAILS.MISSING_REQ_FIELDS');
    }

    if (!isNil(this.record) && this.record instanceof AObject) {
      let referenceInstance = this.record;
      let recordInstance = clone(this.record);
      let labelInstance = this.record.instanceOf(this.label);
      let referenceField = last(split(this.field, '.'));
      let referenceLabel = isNil(this.label) ? referenceField : last(split(this.label, '.'));
      if (!isNil(get(referenceInstance, 'getType'))) {
        this.subscription = this.aobjectService.describe(referenceInstance.getType())
          .pipe(
            switchMap(fieldObjectMetadata => {
              const fieldMetadata = find(get(fieldObjectMetadata, 'FieldMetadata'), fieldData => get(fieldData, 'FieldName') === this.field);
              const labelDescribe$ = (this.valueOnly) ? of(null) : this.aobjectService.describe(labelInstance.getType());
              let recordObsv$ = of(null);
              const objectName = get(fieldMetadata, 'LookupObjectName');
              const keyType = this.metadataService.getTypeByApiName(objectName);
              const service: AObjectService = this.metadataService.getAObjectServiceForType(keyType);
              if (!isNil(get(fieldMetadata, 'LookupObjectName'))) {
                const data$ = (get(this.record, this.field)) ? of(get(this.record, this.field)) : of(null);// TO DO: service.fetch(_.get(this.record, this.field))
                recordObsv$ = this.displayValue ? data$ : of(null)
                this.displayValue = defaultTo(this.displayValue, 'Name');
                referenceField = this.displayValue;
                referenceInstance = this.record.instanceOf(this.field);
                return combineLatest([this.aobjectService.describe(referenceInstance.getType()), labelDescribe$, of(fieldObjectMetadata), recordObsv$]);
              } else {
                return combineLatest(of(fieldObjectMetadata), labelDescribe$, of(fieldObjectMetadata), recordObsv$);
              }
            }),
            rmap(([fieldObjectMetadata, labelObjectMetadata, recordObjectMetadata, resultdata]) => {
              const labelMetadata = find(get(labelObjectMetadata, 'FieldMetadata'), fieldData => get(fieldData, 'FieldName') === referenceLabel);
              const fieldMetadata = find(get(fieldObjectMetadata, 'FieldMetadata'), fieldData => get(fieldData, 'FieldName') === referenceField);
              const recordMetadata = find(get(recordObjectMetadata, 'FieldMetadata'), fieldData => get(fieldData, 'FieldName') === first(split(this.field, '.')));
              const r = {
                metadata: fieldMetadata,
                recordMetadata: recordMetadata,
                value: resultdata ? get(resultdata, 'Name') : this.getValue(referenceInstance, referenceField, fieldMetadata),
                label: defaultTo(get(labelMetadata, 'DisplayName'), this.label),
                field: last(split(this.field, '.')),
                referenceFieldInstance: referenceInstance,
                recordInstance: recordInstance,
                labelPlural: lowerCase(get(fieldObjectMetadata, 'DisplayName')),
                popoverFields: this.getPopoverFields(this.record.instanceOf(this.field)),
                titleIsLink: includes(this.supportedObjectRoutes, lowerCase(get(fieldObjectMetadata, 'DisplayName'))),
                route: LabelPlurals[lowerCase(get(fieldObjectMetadata, 'DisplayName'))]
              } as OutputFieldView;
              if (isNil(r.value) && get(recordMetadata, 'type') === "Currency") {
                r.value = '0';
              }
              return r;
            })
          )
          .subscribe(r => {
            if (this.maxCharacterLength && get(r.value, 'length') > this.maxCharacterLength) {
              r.nonTruncatedValue = r.value;
              r.value = r.value.substring(0, this.maxCharacterLength - 3);
              r.value += '...';
            }
            this.view$.next(r);
          });
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  /**
   * Returns the proper constructor for the record at the given path.
   * @param fieldPath The path to the field for this record.
   * @ignore
   */
  getFieldType(fieldPath: string) {
    if (!isNil(this.record)) {
      let recordConstructor = this.record.constructor as ClassType<AObject>;
      if (fieldPath.indexOf('.') >= 0) {
        const objectInstance = get(new recordConstructor(), fieldPath.substring(0, fieldPath.lastIndexOf('.')));
        if (!isNil(objectInstance))
          recordConstructor = objectInstance.constructor as new (t?) => AObject;
        else
          recordConstructor = this.record.getType();
      }
      return recordConstructor;
    }
  }

  /**
   * Returns the date format based on the metadata of the field on this record.
   * @param metadata The metadata for the field on this record.
   * @ignore
   */
  getDateFormat(metadata) {
    if (this.dateFormat)
      return this.dateFormat;
    else if (metadata.type === 'datetime')
      return 'short';
    else if (metadata.type === 'date')
      return 'shortDate';
  }

  /**
   * Returns the value of the field on this record.
   * @ignore
   */
  getValue(instance: AObject, field: string, metadata: any) {
    return get(instance,

        // If display value input is populated, use the records display value field
        get(this, 'displayValue', field)
      )
      // If default is set to true, default the output to salesforce's default value if no value is found
      // TODO: Update with RLP integration
      // (this.default === true) ? SalesforceUtils.getDefaultValue(metadata) : undefined

  }

  getPopoverFields(instance: AObject): Array<FieldLabel> {
    const compactFields = instance.getFieldMetadata(y => includes(y.view, 'Compact'));
    return map(compactFields, (value, key) => {
      if (!isNil(get(value, 'compactLabel')))
        return { field: key, label: get(value, 'compactLabel') } as FieldLabel;
      return { field: key, label: key } as FieldLabel;
    });
  }

  /**
   * Event handler for when the update button is pressed on the edit field popover.
   * @ignore
   */
  update(view: OutputFieldView) {
    if (this.onChange.observers.length >= 1) {
      this.onChange.emit(get(view, `recordInstance.${view.field}`));
      this.pop.hide();
    }
    else {
      this.loading = true;
      const service = this.metadataService.getAObjectServiceForType(view.recordInstance);
      service.update([view.recordInstance]).subscribe(r => {
        this.loading = false;
        this.pop.hide();
      },
        e => this.loading = false);
    }
  }

  /**
   * Event handler for when the cancel button is pressed on the edit field popover.
   * @ignore
   */
  handleHidePop(view?: OutputFieldView) {
    view && set(view, `recordInstance.${view.field}`, get(this.record, view.field));
    this.pop.hide();
  }

  /**
   * Event handler for when the target of the quickview lookup popover is clicked.
   * @ignore
   */
  handleLookupPopClick() {
    if (this.showQuickView) {
      if (this.lookupPop.isOpen) {
        this.hidePopover();
      }
      else this.lookupPop.show();
    }
  }

  /**
   * Sets the position of the quickview popover based on where the target is on the screen.
   * @ignore
   */
  onShown() {
    if (this.showQuickView) {
      let top, right, bottom, left, middleVert;
      if (get(this.elRef, 'nativeElement')) {
        top = this.elRef.nativeElement.getBoundingClientRect().top;
        right = this.elRef.nativeElement.getBoundingClientRect().right;
        bottom = this.elRef.nativeElement.getBoundingClientRect().bottom;
        left = this.elRef.nativeElement.getBoundingClientRect().left;
        middleVert = (top + bottom) / 2;
      }
      let position;
      // If too close to the top or bottom of page show vertically
      if (middleVert < 250 || window.innerHeight - middleVert < 250) {
        if (middleVert < 250) position = 'bottom';
        else position = 'top';
      }
      else {
        // Pick left or right which ever has more space
        if (window.innerWidth - right > left) position = 'right';
        else position = 'left';
        // If there is not enough space on either side pick top or bottom
        if (window.innerWidth - right < 320 && left < 320) {
          // If there is more space on the top.
          if (middleVert > window.innerHeight / 2) position = 'top';
          else position = 'bottom';
        }
      }
      return position;
    }
  }

  /**
   * Hides the quickview popover.
   * @ignore
   */
  hidePopover() {
    if (this.lookupPop) {
      this.lookupPop.hide();
    }
    this.expanded = false;
  }

}
/** @ignore */
interface OutputFieldView {
  metadata: any;
  recordMetadata: any;
  value: string;
  nonTruncatedValue?: string;
  label: string;
  field: string;
  recordInstance: AObject;
  referenceFieldInstance: AObject;
  popoverFields: Array<FieldLabel>;
  route: string;
}

/** @ignore */
interface FieldLabel {
  field: string;
  label: string;
}
/**@ignore */
export enum LabelPlurals {
  order = 'orders',
  proposal = 'proposals',
  product = 'products',
  cart = 'carts',
  asset = 'assets'
}
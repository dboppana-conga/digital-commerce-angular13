import { Injectable } from '@angular/core';
import { AObjectService, MetadataService } from '@congacommerce/core';
import { MatrixResult, MatrixMetadata, AllowedValues } from '../interfaces/attribite-value-matrix.interface';
import { ProductAttributeMatrixView } from '../classes/index';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { Product, ProductAttributeValue } from '../../catalog/classes/index';
import { ProductService, ProductAttributeService } from '../../catalog/services/index';
import { map, mergeMap } from 'rxjs/operators';
import { memoize } from 'lodash-decorators';

/**@ignore */
@Injectable({
  providedIn: 'root'
})

export class AttributeValueMatrixService extends AObjectService {
  type = ProductAttributeMatrixView;

  dataBits;
  dataLength;
  padCount;
  nodeCount;
  directorySize;
  directoryStart;
  labelSize;
  letterStart;
  l2Size;
  l1Size;
  l1Bits;
  l2Bits;
  sectionBits;

  protected productService: ProductService = this.injector.get(ProductService);
  metadataService: MetadataService = this.injector.get(MetadataService);
  productAttributeService: ProductAttributeService = this.injector.get(ProductAttributeService);

  onInit() {
    this.l2Size = 15;
    this.l1Size = this.l2Size * this.l2Size;
  }

  /** -- Method declarations -- */
  init(data) {
    this.dataBits = new BitString(data);
    this.dataLength = this.dataBits.length;
    // fetch pad count, from end of data (3 bits)
    this.padCount = this.dataBits.getBitNumber(this.dataLength - 3, 3);
    // get node count (20 bits ending at length - 3 bits)
    this.nodeCount = this.dataBits.getBitNumber(this.dataLength - 23, 20);
    // get directory size (20 bits ending at length - 23 bits)
    this.directorySize = this.dataBits.getBitNumber(this.dataLength - 43, 20);
    // calculate directory start index
    this.directoryStart = this.directorySize <= 0 ? 0 : this.dataLength - this.padCount - this.directorySize - 43;
    // calculate the label sizes (4 bits, after trie bit vector)
    this.labelSize = this.dataBits.getBitNumber(this.nodeCount * 2 + 1, 4);
    // The position of the first bit of the data in 0th node.
    this.letterStart = this.nodeCount * 2 + 5;
    // calculate L1 bits width
    this.l1Bits = Math.floor(Math.log(this.nodeCount * 2 + 1) / Math.log(2)) + 1;
    // calculate L2 bits width
    this.l2Bits = Math.floor(Math.log(this.l1Size) / Math.log(2)) + 1;
    // calculate bits in directory entry
    this.sectionBits = (this.l1Size / this.l2Size - 1) * this.l2Bits + this.l1Bits;
  }

  /**
    Retrieve the root node. You can use this node to obtain all of the other
    nodes in the trie.
    */
  getRoot() {
    return this.getNodeByIndex(0);
  }

  /**
   * Retrieve the FrozenTrieNode of the trie, given its index in level-order.
   */
  getNodeByIndex(index: number, parentNode?: any) {
    // retrieve the node letter.
    const letterOffset = this.letterStart + ((index - 1) * this.labelSize);
    const letter = this.dataBits.getBitNumber(letterOffset, this.labelSize);
    // get index of first child
    const firstChild = this.select(0, index + 1) - index;
    // Nodes are encoded in level order, so child of first node
    // must be past the 0 in this position
    const childOfNextNode = this.select(0, index + 2) - index - 1;

    return new AptValueMatrixNode(this, index, letter, firstChild, parentNode, childOfNextNode - firstChild);
  }

  /**
   * Returns the position of the y'th 0 or 1 bit, depending on the "which"
   * parameter.
   */
  select(which, y) {
    let high = this.nodeCount * 2 + 1;
    let low = -1;
    let val = -1;

    while (high - low > 1) {
      const probe = (high + low) / 2 | 0;
      const selectRank = this.rank(which, probe);

      if (selectRank === y) {
        // We have to continue searching after we have found it,
        // because we want the _first_ occurrence.
        val = probe;
        high = probe;
      } else if (selectRank < y) {
        low = probe;
      } else {
        high = probe;
      }
    }

    return val;
  }

  /**
   * Returns the number of 1 or 0 bits (depending on the "which" parameter) to
   * to and including position x.
   */
  rank(which, x) {
    if (which === 0) {
      return x - this.rank(1, x) + 1;
    }

    let selectRank = 0;
    let o = x;
    let sectionPos = 0;

    if (o >= this.l1Size) {
      sectionPos = (o / this.l1Size | 0) * this.sectionBits;
      selectRank = this.dataBits.getBitNumber(this.directoryStart + (sectionPos - this.l1Bits), this.l1Bits);
      // calculate bits which have not been summarized
      o = o % this.l1Size;
    }

    if (o >= this.l2Size) {
      sectionPos += (o / this.l2Size | 0) * this.l2Bits;
      selectRank += this.dataBits.getBitNumber(this.directoryStart + (sectionPos - this.l2Bits), this.l2Bits);
    }

    selectRank += this.dataBits.countOnesBits(x - x % this.l2Size, x % this.l2Size + 1);

    return selectRank;
  }

  @memoize((pList) => JSON.stringify([_.map(pList)]))
  getAttributeMatrixForProducts(productList: Array<string> | Array<Product>): Observable<Array<ProductAttributeMatrixView>> {
    return this.cacheService.buffer(
      'attributeMatrixView',
      productList,
      (allProducts) => {
        return this.getAttributeMatrix(_.flatten(allProducts));
      },
      (results) => {
        return results;
        // return _.flatten(_.map(results, r => _.get(r, '_metadata.rules')));
      },
      100,
      10
    );
  }
  /**
   * Gets the matrix view for the given product.
   * @param product instance of product object.
   * @param hasAttr If it's true get the matrix view for the product
   * @returns Observable array of Allowed values for the given product.
   * To Do:
   */
  getAttributeMatrix(productList: Array<string> | Array<Product>): Observable<Array<ProductAttributeMatrixView>> {
    if (productList) {
      // First query retrieves list of potential rules that the product list is a member of
      productList = (<any>productList).filter(p => p != null);
      // const product$ = ((<Array<any>>productList).every((item: any) => typeof (<any>item) === 'string')) ? this.productService.get(<Array<string>>productList) : of(productList);
      const product$ = of(productList);
      // return product$.pipe(mergeMap((_productList: Array<Product>) => {
      //   const groupIds = _.uniq(_productList.map(p => _.get(p, 'AttributeGroups').map(r => r.AttributeGroupId)));
      //   const filterList: Array<AFilter> = [];
      //   if (groupIds) {
      //     filterList.push(new AFilter(this.type, [new ACondition(this.type, 'ProductId', 'Equal', null),
      //     new ACondition(this.type, 'ProductAttributeScopeId', 'In', groupIds), new ACondition(this.type, 'AttributeValueMatrix.Active', 'Equal', true)], null, 'AND'));
      //   }
      //   return this.query({
      //     filters: filterList,
      //   })
      //     .pipe(
      //       map(matrixResults => {
      //         return matrixResults;
      //       })
      //     );
      // }));
      return null;
    }
  }

  /**
     * Process the attribute matrix rules
     * Modes of operation: (Default mode is 1)
     * <1> Default and treat null as nothing is applicable
     * <2> Default and treat null as a wild card, i.e. many default values
     * <3> Constrain and treat null as a no value is available
     * <4> Constrain and treat null as a wild card, i.e. all values available
     *
     * @param matrixInfos the Array of ProductAttributeMatrixView from server
     * @param attrMetadata attribute field metadata map
     * @return a mapping of the available values by field API name
     */

  processAttributeMatrices(matrixInfos: Array<ProductAttributeMatrixView>, attrMetadata: any, attributeSO?: ProductAttributeValue, userSelected?: any, lastTouched?: string, userCleared?: any, attributeSOCopy?: ProductAttributeValue): Array<AllowedValues> {
    let matrixResults: MatrixResult = {
      defaults: {},
      constraints: {},
      forceSets: {},
      reset: {},
      items: [],
    };

    matrixInfos.forEach((rule: ProductAttributeMatrixView) => {

      if (_.isUndefined(_.get(rule, '_metadata.reverseKeys'))) {
        // store reverse key lookup
        _.set(rule, '_metadata.reverseKeys', {});
        let keyMap = JSON.parse(rule.Keys);
        _.map(keyMap, function (value, key) {
          if (keyMap.hasOwnProperty(key)) {
            rule._metadata.reverseKeys[keyMap[key]] = key;
          }
        });
        // update hash key with actual object bindings
        rule.Keys = keyMap;
      }

      const columnDetails = JSON.parse(rule.Columns);
      const columns = columnDetails.columns;
      const items = [];
      let restoreColumns = [];
      let lastTouchedIdx = null;
      let controlIdx = null;
      let hasUserClearedSelection = false;

      for (let key in columns) {
        if (columns.hasOwnProperty(key)) {
          const fieldName = columns[key];
          const fieldType = attrMetadata.fields.find(r => r.name === columns[key]).type;
          const isSelectType = (fieldType === 'multipicklist') || (fieldType === 'picklist');
          const isMultiSelect = fieldType === 'multipicklist';
          let itemValue;

          itemValue = _.get(attributeSO, `${fieldName}`);
          if (isMultiSelect) itemValue = _.isNil(itemValue) ? [] : _.split(itemValue, ';');
          if ((itemValue instanceof Array && _.get(itemValue, 'length') >= 0 && !isMultiSelect) ||
            (itemValue instanceof Array && _.get(itemValue, 'length') === 0 && isMultiSelect)) itemValue = undefined;

          if (fieldName === lastTouched) {
            lastTouchedIdx = items.length;
          }

          const item: MatrixMetadata = {
            Name: fieldName,
            Id: fieldName,
            value: itemValue, // value is modified by rule processor
            columnValue: itemValue,
            isMultiSelect: isMultiSelect,
            isSelectType: isSelectType,
            isWildcard: (_.get(rule, 'AttributeValueMatrix.TreatNullAsWildcard') === true) ? true : false
          };

          const isUserSelected = _.get(userSelected, `${fieldName}`);
          const isUserCleared = _.get(userCleared, `${fieldName}`);
          const isLastTouched = item.Id === lastTouched;
          if (_.get(rule, 'AttributeValueMatrix.ApplicationType') !== 'Force Set'
            && isUserCleared === true) {
            restoreColumns.push(items.length);
            hasUserClearedSelection = true;
          }

          // set the controlling column
          if ((_.get(rule, 'AttributeValueMatrix.ApplicationType') !== 'Force Set'
            && isUserSelected === true && isUserCleared === true)) {
            restoreColumns.push(items.length);
            controlIdx = items.length;

          } else if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Force Set'
            && isLastTouched) {
            controlIdx = items.length;

          }
          // add item to collection
          items.push(item);
        }
      }
      matrixResults.items = _.concat(matrixResults.items, items);
      // If user clears a value from one attribute and changes another, the latter becomes the control.
      // E.g. USA | CA | San Mateo, clear CA and choose another city in the US, State should lock to value
      // containing the selected city (USA | AZ | Phoenix).
      if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Constrain' && hasUserClearedSelection && _.get(userSelected, `${lastTouched}`) && controlIdx === null) {
        controlIdx = lastTouchedIdx;
      }

      // user cleared and picked new value, so it becomes
      // the new "user selection"
      if (controlIdx !== null) {
        const validCombinationNew = this.getAvailableForNewSelection(controlIdx, items, rule);
        for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
          const item = items[itemIdx];
          const fieldName = items[itemIdx].Id;
          let availableForField = matrixResults.constraints[fieldName];
          const validCombination = this.getValidValues(validCombinationNew[fieldName], fieldName, items, rule);
          if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Force Set') {
            // union all of the values together
            availableForField = matrixResults.forceSets[fieldName];
            _.set(matrixResults, `forceSets.${fieldName}`, _.union(availableForField, validCombination));
          } else if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Default') {
            // additional defaults creates a union
            availableForField = matrixResults.defaults[fieldName];
            _.set(matrixResults, `defaults.${fieldName}`, _.union(availableForField, validCombination));
          } else {
            // intersection of available values
            availableForField = matrixResults.constraints[fieldName];
            if (_.isUndefined(availableForField)) {
              _.set(matrixResults, `constraints.${fieldName}`, validCombination);
            } else {
              _.set(matrixResults, `constraints.${fieldName}`, _.intersection(availableForField, validCombination));
            }
          }
        }
      } else if (!hasUserClearedSelection || _.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Constrain') {
        // collect the new matrix values
        const validCombinations = this.getAvailableValues(items, rule);
        for (const fieldName in validCombinations) {
          if (validCombinations.hasOwnProperty(fieldName)) {
            let validCombination = validCombinations[fieldName];
            validCombination = this.getValidValues(validCombination, fieldName, items, rule);

            if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Force Set') {
              // union all of the values together
              const availableForField = matrixResults.forceSets[fieldName];
              _.set(matrixResults, `forceSets.${fieldName}`, _.union(availableForField, validCombination));
            } else if (_.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Default') {
              // additional defaults creates a union
              const availableForField = matrixResults.defaults[fieldName];
              _.set(matrixResults, `defaults.${fieldName}`, _.union(availableForField, validCombination));
            } else {
              // intersection of available values
              const availableForField = matrixResults.constraints[fieldName];
              if (_.isUndefined(availableForField)) {
                _.set(matrixResults, `constraints.${fieldName}`, validCombination);
              } else {
                _.set(matrixResults, `constraints.${fieldName}`, _.intersection(availableForField, validCombination));

              }
            }
          }
        }
      }

      if (controlIdx == null &&
        _.get(rule, 'AttributeValueMatrix.ApplicationType') === 'Constrain' &&
        restoreColumns.length) { // user cleared selection will open up all values
        if (_.isUndefined(_.get(rule, '_metadata.allOptions'))) {
          rule._metadata.allOptions = this.getAllOptions(items, rule);

        }

        // build the reset columns
        for (let restoreIdx = 0; restoreIdx < restoreColumns.length; restoreIdx++) {
          let itemIdx = restoreColumns[restoreIdx];
          let fieldName = items[itemIdx].Id;

          let availableForField = matrixResults.reset[fieldName];
          if (_.isUndefined(availableForField)) {
            matrixResults.reset[fieldName] = rule._metadata.allOptions[fieldName];

          } else {
            matrixResults.reset[fieldName] = _.intersection(availableForField, rule._metadata.allOptions[fieldName]);

          }
        }
      } else if (controlIdx !== null) { // remove user cleared flag
        const resetField = items[controlIdx].Id;
        for (let count = 0; count < items.length; count++) {
          if (count !== controlIdx) {
            _.get(userCleared, `${items[count].Id}`, false);
          }
        }
      }
    }, this);
    matrixResults.items = _.uniqBy(matrixResults.items, 'Name');
    return this.getAllowedValues(matrixResults, attributeSO, attributeSOCopy);
  }

  /**
  * Get values avaialble given new selection.
  * This method will attempt to retain as many pre-selcted values,
  * i.e. whichever values are valid with the newIdx being the driver
  *
  * @param newIdx the index of the newly updated column
  * @param columns the column details
  * @param matrixInfo the matrix info
  * @return mapping of valid combinations
  */
  getAvailableForNewSelection(newIdx, columns, matrixInfo) {
    for (let itemIdx = 0; itemIdx < columns.length; itemIdx++) {
      if (newIdx === itemIdx) {
        continue;
      }

      // setup wildcard override
      for (let siblingIdx = 0; siblingIdx < columns.length; siblingIdx++) {
        let siblingItem = columns[siblingIdx];
        siblingItem.isWildcard =
          siblingIdx !== newIdx && siblingIdx > itemIdx;
      }

      // check valid for this combination
      const checkItem = columns[itemIdx];
      const resetItem = columns[newIdx];
      const resetField = resetItem.Id;
      const validCombinations = this.getAvailableValues(columns, matrixInfo);
      const resetChoices = this.getValidValues(validCombinations[resetField], resetField, columns, matrixInfo);
      if (resetChoices.indexOf(resetItem.value) < 0) {
        checkItem.value = null;
      }
    }

    // remove the wildcard override and re-execute
    for (let itemIdx = 0; itemIdx < columns.length; itemIdx++) {
      let item = columns[itemIdx];
      item.isWildcard = false;

    }

    // retain as many selections as possible
    return this.getAvailableValues(columns, matrixInfo);
  }

  setFieldValues(matrixView: Array<AllowedValues>, attributeSO?: ProductAttributeValue, attributeSOCopy?: ProductAttributeValue): Array<AllowedValues> {
    _.forEach(matrixView, (view) => {
      if (view.allowedValues && !_.isEmpty(view.resetValues)) {
        const resttemp = Object.keys(view.resetValues);
        for (let i = 0; i < resttemp.length; i++) {
          const attributeVal = _.get(attributeSO, `${resttemp[i]}`) ? _.get(attributeSO, `${resttemp[i]}`).split(';').sort() : [];
          if (view.items.isMultiSelect && _.some(view.resetValues[resttemp[i]])) {
            view.resetValues[resttemp[i]] = view.resetValues[resttemp[i]].sort();
          }
          if (!_.isEqual(attributeVal, view.resetValues[resttemp[i]])) {
            if (view.items.isSelectType && !view.items.isMultiSelect) {
              view.items.value = null;
            } else if (view.items.isMultiSelect && view.resetValues[resttemp[i]].length === 0) {
              // view.items.value = [].join(';');
              view.items.value = null;
            } else if (view.items.isMultiSelect && view.resetValues[resttemp[i]].length > 0) {
              const val = _.intersection(view.resetValues[resttemp[i]], [attributeSO[resttemp[i]]]);
              view.items.value = val.join(';');
            }
          }
          if (_.isEmpty(view.items.value)) view.items.value = null;
        }
      } else {
        if (view.allowedValues && !_.isEmpty(view.constraints)) {
          const temp = Object.keys(view.constraints);
          for (let i = 0; i < temp.length; i++) {
            const attributeVal = _.get(attributeSO, `${temp[i]}`) ? _.get(attributeSO, `${temp[i]}`).split(';').sort() : [];
            if (view.items.isMultiSelect && _.some(view.constraints[temp[i]])) {
              view.constraints[temp[i]] = view.constraints[temp[i]].sort();
            }
            if (!_.isEqual(attributeVal, view.constraints[temp[i]])) {
              if (view.items.isSelectType && !view.items.isMultiSelect && _.get(view.constraints[temp[i]], 'length') > 1) {
                if (!view.items.columnValue) view.items.value = null;
              } else if (view.items.isMultiSelect && view.constraints[temp[i]].length === 0) {
                if (_.get(attributeSO[temp[i]], 'length') > 0) view.items.value = attributeSO[temp[i]].join(';');
                else
                  view.items.value = null;
              } else if (view.items.isMultiSelect && view.constraints[temp[i]].length > 1) {
                const val = _.intersection(view.constraints[temp[i]], [attributeSO[temp[i]]]);
                view.items.value = val.join(';');
              } else {
                if (view.items.isSelectType && !view.items.isMultiSelect) {
                  view.items.value = view.constraints[temp[i]][0];
                } else {
                  if (attributeSO.hasOwnProperty(temp[i]) && view.items.columnValue) {
                    view.items.value = _.intersection(view.constraints[temp[i]], [attributeSO[temp[i]]]).join(';');

                  } else if (!attributeSO.hasOwnProperty(temp[i]) && !view.items.columnValue) {
                    view.items.value = view.constraints[temp[i]].join(';');

                  } else {
                    view.items.value = view.constraints[temp[i]].join(';');
                  }
                }
              }
            } else {
              if (!_.get(attributeSO, `${temp[i]}`) && view.items.isSelectType && !view.items.isMultiSelect) {
                view.items.value = null;
              } else if (_.get(attributeSO, `${temp[i]}.length`) === 0 && view.items.isMultiSelect) {
                view.items.value = null;
              } else {
                view.items.value = _.get(attributeSO, `${temp[i]}`);
              }
            }
            if (_.isEmpty(view.items.value)) view.items.value = null;
          }
        }
        if (view.allowedValues && !_.isEmpty(view.forceSets)) {
          const forcesettemp = Object.keys(view.forceSets);
          for (let i = 0; i < forcesettemp.length; i++) {
            const attributeVal = _.get(attributeSO, `${forcesettemp[i]}`) ? _.get(attributeSO, `${forcesettemp[i]}`).split(';').sort() : [];
            if (view.items.isMultiSelect && _.some(view.forceSets[forcesettemp[i]])) {
              view.forceSets[forcesettemp[i]] = view.forceSets[forcesettemp[i]].sort();
            }
            if (!_.isEqual(attributeVal, view.forceSets[forcesettemp[i]])) {
              if ((view.items.isSelectType && !view.items.isMultiSelect && view.forceSets[forcesettemp[i]].length > 1)) {
                if (attributeSO[forcesettemp[i]]) {
                  view.items.value = attributeSO[forcesettemp[i]];
                } else {
                  view.items.value = null;
                }
              } else if (view.items.isMultiSelect && view.forceSets[forcesettemp[i]].length > 1) {
                if (attributeSO.hasOwnProperty(forcesettemp[i]) && !view.items.columnValue) {
                  view.items.value = _.intersection(view.forceSets[forcesettemp[i]], [attributeSO[forcesettemp[i]]]).join(';');
                } else if (attributeSO.hasOwnProperty(forcesettemp[i]) && view.items.columnValue) {
                  view.items.value = view.items.columnValue.join(';');
                } else if (attributeSO.hasOwnProperty(forcesettemp[i]) && !view.items.columnValue) {
                  view.items.value = _.union(view.forceSets[forcesettemp[i]], [attributeSO[forcesettemp[i]]]).join(';');
                } else if (view.forceSets[forcesettemp[i]].length === 0) {
                  if (attributeSOCopy.hasOwnProperty(forcesettemp[i])) view.items.value = attributeSOCopy[forcesettemp[i]].join(';');
                }
              } else {
                if (view.items.isSelectType && !view.items.isMultiSelect) {
                  view.items.value = view.forceSets[forcesettemp[i]][0];
                } else if (view.items.isSelectType && view.items.isMultiSelect) {
                  view.items.value = _.join(view.forceSets[forcesettemp[i]], ';');
                } else {
                  view.items.value = view.forceSets[forcesettemp[i]];
                }
              }
            } else {
              if (view.items.isMultiSelect) {
                const val = _.union(attributeSO[forcesettemp[i]], [attributeSO[forcesettemp[i]]]);
                view.items.value = val.join(';');
              } else if (view.items.isSelectType && !view.items.isMultiSelect) {
                view.items.value = view.forceSets[forcesettemp[i]].join(';');
              }
            }
            if (_.isEmpty(view.items.value)) view.items.value = null;
          }
        }
        if (view.allowedValues && !_.isEmpty(view.defaults)) {
          const defaulttemp = Object.keys(view.defaults);
          for (let i = 0; i < defaulttemp.length; i++) {
            const attributeVal = _.get(attributeSO, `${defaulttemp[i]}`) ? _.get(attributeSO, `${defaulttemp[i]}`).split(';').sort() : [];
            if (view.items.isMultiSelect && _.some(view.defaults[defaulttemp[i]])) {
              view.defaults[defaulttemp[i]] = view.defaults[defaulttemp[i]].sort();
            }
            if (!_.isEqual(attributeVal, view.defaults[defaulttemp[i]])) {
              if (view.items.isSelectType && !view.items.isMultiSelect) {
                if (_.get(attributeSO, `${defaulttemp[i]}`)) view.items.value = _.get(attributeSO, `${defaulttemp[i]}`);
                else if (view.defaults[defaulttemp[i]] > 1)
                  view.items.value = null;
                else
                  view.items.value = view.defaults[defaulttemp[i]][0];
              } else {
                if (view.defaults[defaulttemp[i]].length === 0 && attributeSO[defaulttemp[i]].length === 0) {
                  view.items.value = [].join(';');
                } else
                  view.items.value = _.union(view.defaults[defaulttemp[i]], attributeSO[defaulttemp[i]]).join(';');
              }
            }
            if (_.isEmpty(view.items.value)) view.items.value = null;
          }
        }
      }
    });
    return matrixView;
  }

  /**
   * Get all available options
   * @param items the context columns
   * @param matrixInfo the matrix info
   * @return list of all combinations
   */
  getAllOptions(items, matrixInfo) {
    const ctxItems = _.cloneDeep(items);
    for (let itemIdx = 0; itemIdx < ctxItems.length; itemIdx++) {
      const item = ctxItems[itemIdx];
      item.isWildcard = true;
    }

    return this.getAvailableValues(ctxItems, matrixInfo);
  }

  /**
   * Get the valid values
   * @param validCombination the valid combinations including "null"
   * @param nullAsWildcard whether to treat null as wildcard or true value
   * @return valid combinations. modifies list
   */
  getValidValues(validCombination, fieldName, allItems, matrixInfo) {
    // build null key
    let nullIdx = validCombination.indexOf(null);
    if (nullIdx >= 0) {
      if (_.get(matrixInfo, 'AttributeValueMatrix.TreatNullAsWildcard') === true) { // Null treated as a wildcard by default
        if (_.isUndefined(_.get(matrixInfo, '_metadata.allOptions'))) {
          matrixInfo._metadata.allOptions = this.getAllOptions(allItems, matrixInfo);
        }

        validCombination = matrixInfo._metadata.allOptions[fieldName];
        nullIdx = validCombination.indexOf(null);
        if (nullIdx >= 0) {
          validCombination.splice(nullIdx, 1);
        }
      } else {
        validCombination.length = 0; // nothing is applicable
      }
    }

    return validCombination;
  }

  /**
   * Get the available values for the given combination
   * @param items the items to test
   * @param matrixInfos the AttributeMatrixDO
   * @return a mapping of the available values by item id
   */
  getAvailableValues(items, matrixInfo) {
    // init values
    this.init(matrixInfo.Hash);
    let level = 0;
    let nodesForLevel = this.getRoot().getChildren();
    const availableValues = {};

    while (level < items.length && nodesForLevel.length > 0) {
      const levelInput = items[level];
      const levelSize = nodesForLevel.length;
      const isMultiSelect = levelInput.isMultiSelect;
      const isSelectType = levelInput.isSelectType;

      const nodeKeys = {};
      let isWildCard = true; // wildcard behavior by default
      if (levelInput.isWildcard !== true
        && !_.isUndefined(levelInput.value)
        && levelInput.value !== null) {
        // determine node keys
        let inputArray = [levelInput.value];
        if (isMultiSelect) {
          inputArray = levelInput.value instanceof Array ? levelInput.value : levelInput.value.split(';');
          for (let idx = 0, len = inputArray.length; idx < len; idx++) {
            const inputValue = inputArray[idx];
            nodeKeys[inputValue] = inputValue;

          }
        }
        else {
          const nodeKey = _.get(matrixInfo, '_metadata.reverseKeys')[levelInput.value];
          if (!_.isUndefined(nodeKey)) {
            nodeKeys[nodeKey] = nodeKey;
          }
        }

        isWildCard = false;
      }

      // console.log('level=' + level + '  nodeKey=' + nodeKey + ' node.letter==' + node.letter);
      if (isWildCard || levelInput.isWildcard) { // wildcards
        if (level < items.length - 1) {
          for (let m = 0; m < levelSize; m++) {
            const node = nodesForLevel.shift();
            const children = node.getChildren();
            for (let n = 0; n < children.length; n++) {
              // add back for next level inspection
              const child = children[n];
              nodesForLevel.push(child);
            }
          }
        }
      } else {
        for (let k = 0; k < levelSize; k++) {
          const node = nodesForLevel.shift();
          const nodeLetter = node.letter;
          const nodeKey = matrixInfo.Keys[nodeLetter];
          // always include null if matrix accepts wildcards
          if (nodeKey === null && _.get(matrixInfo, 'AttributeValueMatrix.TreatNullAsWildcard') === true) {
            if (level === items.length - 1) {
              nodesForLevel.push(node);

            } else { // willd check next level
              nodesForLevel = nodesForLevel.concat(node.getChildren());
            }
          } else {
            let splitLetter = [nodeLetter];
            if (isMultiSelect) {
              if (nodeKey === null) {
                splitLetter = [null];
              } else {
                splitLetter = nodeKey instanceof Array ? nodeKey : nodeKey.split(';');
              }
            }

            for (let p = 0; p < splitLetter.length; p++) {
              const letter = splitLetter[p];
              if (!_.isUndefined(nodeKeys[letter])) { // matching node
                if (level === items.length - 1) {
                  nodesForLevel.push(node);

                } else { // willd check next level
                  nodesForLevel = nodesForLevel.concat(node.getChildren());

                }

                break;
              }
            }
          }
        }
      }
      level += 1;
    }
    // console.log('results=');
    //  console.log('nodesForLevel',nodesForLevel);

    // populate list backwards from the leaf node
    let addedColumns = {};
    if (!_.isUndefined(items) && items != null) {
      for (let i = level - 1; i >= 0; i--) {
        addedColumns[i] = [];

        let valuesForLevel = [];
        const item = items[i];
        const levelSize = nodesForLevel.length;
        for (let j = 0; j < levelSize; j++) {
          const node = nodesForLevel.shift();
          if (_.isUndefined(addedColumns[i][node.letter])) {
            const optionValue = matrixInfo.Keys[node.letter];
            if (item.isSelectType) {
              if (item.isMultiSelect) {
                const splitOptions = optionValue === null ? null : (optionValue instanceof Array) ? optionValue : optionValue.split(';');
                valuesForLevel = _.uniq(valuesForLevel.concat(splitOptions));
              } else {
                valuesForLevel.push(optionValue);
              }
            } else {
              valuesForLevel.push(optionValue);

            }

            addedColumns[i][node.letter] = true;
          }

          const parentNode = node.getParent();
          if (parentNode != null) {
            nodesForLevel.push(parentNode);

          }
        }

        availableValues[item.Id] = valuesForLevel;
      }

      for (; level < items.length; level++) {
        const column = items[level];
        availableValues[column.Id] = [];
      }
    }

    return availableValues;

  }

  /**
   * @ignore
  *
  */
  private getAllowedValues(matrixResults: MatrixResult, attributeSO?: ProductAttributeValue, attributeSOCopy?: ProductAttributeValue): Array<AllowedValues> {
    let validCombinations: Array<AllowedValues> = [];
    const evaluatedMatrixFields = _.uniq(this.matrixResultFields(matrixResults));

    for (let count = 0; count < evaluatedMatrixFields.length; count++) {
      let fieldName = evaluatedMatrixFields[count];
      let allowedValues;
      let resetValue;

      const hasMatrixConstraint = matrixResults && matrixResults.constraints[fieldName];
      const matrixAllows = (matrixResults && matrixResults.constraints[fieldName]) || [];

      if (hasMatrixConstraint) {
        allowedValues = matrixAllows;
        resetValue = matrixResults.reset;
      } else if (matrixResults && matrixResults.reset[fieldName]) { // matrix reset
        allowedValues = matrixResults.reset[fieldName];
      } else {
        allowedValues = true; // indicates allow all values
      }
      validCombinations.push({
        allowedValues: allowedValues,
        resetValues: _.pick(resetValue, fieldName),
        defaults: _.pick(matrixResults.defaults, fieldName),
        constraints: _.pick(matrixResults.constraints, fieldName),
        forceSets: _.pick(matrixResults.forceSets, fieldName),
        items: _.find(matrixResults.items, r => r.Name === fieldName)
      });
    }
    validCombinations = this.setFieldValues(validCombinations, attributeSO, attributeSOCopy);
    return validCombinations;
  }

  /**
   * @ignore
   */

  // tslint:disable-next-line:prefer-function-over-method
  private matrixResultFields(matrixResults: MatrixResult): any {
    const matrixFields = [];
    _.forEach(_.keys(matrixResults.constraints), (fieldKey) => {
      matrixFields.push(fieldKey);
    });
    _.forEach(_.keys(matrixResults.defaults), (fieldKey) => {
      matrixFields.push(fieldKey);
    });
    _.forEach(_.keys(matrixResults.reset), (fieldKey) => {
      matrixFields.push(fieldKey);
    });
    _.forEach(_.keys(matrixResults.forceSets), (fieldKey) => {
      matrixFields.push(fieldKey);
    });
    return matrixFields;
  }
}


/**
 * This class is used for traversing the succinctly encoded trie.
 */
export class AptValueMatrixNode {
  children = null;
  node;

  constructor(trie, index, letter, firstChild, parent, childCount) {
    this.children = null;
    this.node = this;
    /** -- Attach public variables -- */
    this.node.trie = trie;
    this.node.index = index;
    this.node.letter = letter;
    this.node.firstChild = firstChild;
    this.node.parent = parent;
    this.node.childCount = childCount;
    this.node.getParent = this.getParent;
    this.node.getChild = this.getChild;
    this.node.getChildren = this.getChildren;
    this.node.getChildCount = this.getChildCount;
  }
  /**
   * Returns the number of children.
   */
  getChildCount() {
    return this.node.childCount;
  }

  /**
   * Returns the FrozenTrieNode for the given child.
   * @param index The 0-based index of the child of this node. For example, if
   * the node has 5 children, and you wanted the 0th one, pass in 0.
   */
  getChild(index) {
    const result = null;
    return this.node.trie.getNodeByIndex(this.node.firstChild + index, this.node);

  }

  /**
   * Returns the FrozenTrieNode for all children
   */
  getChildren() {
    if (this.node.children == null) {
      this.node.children = [];
      for (let i = 0; i < this.node.childCount; i++) {
        this.node.children.push(this.getChild(i));
      }
    }

    return this.node.children;
  }

  /**
   * Return the parent node
   */
  getParent() {
    return this.node.parent;
  }
}

/**
* Given a string of data, the BitString class supports
* reading or counting a number of bits from an arbitrary position in the
* string.
*/
export class BitString {
  str;
  bytes;
  length;
  MaskTop = [
    0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x01, 0x00
  ];

  BitsInByte = [
    0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2,
    3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3,
    3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3,
    4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4,
    3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5,
    6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4,
    4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5,
    6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5,
    3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3,
    4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6,
    6, 7, 6, 7, 7, 8
  ];
  AlphabetDigits = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5,
    'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11,
    'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17,
    'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23,
    'Y': 24, 'Z': 25, 'a': 26, 'b': 27, 'c': 28, 'd': 29,
    'e': 30, 'f': 31, 'g': 32, 'h': 33, 'i': 34, 'j': 35,
    'k': 36, 'l': 37, 'm': 38, 'n': 39, 'o': 40, 'p': 41,
    'q': 42, 'r': 43, 's': 44, 't': 45, 'u': 46, 'v': 47,
    'w': 48, 'x': 49, 'y': 50, 'z': 51, '0': 52, '1': 53,
    '2': 54, '3': 55, '4': 56, '5': 57, '6': 58, '7': 59,
    '8': 60, '9': 61, '-': 62, '_': 63
  };

  constructor(str) {
    this.bytes = str;
    this.length = this.bytes.length * this.encodingWidth;
  }

  encodingWidth = 6;

  /**
 * Returns the internal string of bytes
 */
  getData() {
    return this.bytes;
  }
  /**
* Returns a decimal number, consisting of a certain number, numDigits, of bits
* starting at a certain position, startPosition.
*/
  getBitNumber(startPosition: number, numDigits: number) {
    // case 1: bits lie within the given byte
    if ((startPosition % this.encodingWidth) + numDigits <= this.encodingWidth) {
      return (this.AlphabetDigits[this.bytes[startPosition / this.encodingWidth | 0]] & this.MaskTop[startPosition % this.encodingWidth]) >>
        (this.encodingWidth - startPosition % this.encodingWidth - numDigits);

      // case 2: bits lie incompletely in the given byte
    } else {
      let result = (this.AlphabetDigits[this.bytes[startPosition / this.encodingWidth | 0]] &
        this.MaskTop[startPosition % this.encodingWidth]);

      const remainder = this.encodingWidth - startPosition % this.encodingWidth;
      startPosition += remainder;
      numDigits -= remainder;

      while (numDigits >= this.encodingWidth) {
        result = (result << this.encodingWidth) | this.AlphabetDigits[this.bytes[startPosition / this.encodingWidth | 0]];
        startPosition += this.encodingWidth;
        numDigits -= this.encodingWidth;
      }

      if (numDigits > 0) {
        result = (result << numDigits) | (this.AlphabetDigits[this.bytes[startPosition / this.encodingWidth | 0]] >>
          (this.encodingWidth - numDigits));
      }

      return result;
    }
  }
  /**
* Counts the number of bits set to 1 starting at position p and
* ending at position startPosition + numDigits
*/
  countOnesBits(startPosition, numDigits) {
    let count = 0;
    while (numDigits >= 8) {
      count += this.BitsInByte[this.getBitNumber(startPosition, 8)];
      startPosition += 8;
      numDigits -= 8;
    }

    return count + this.BitsInByte[this.getBitNumber(startPosition, numDigits)];
  }
}
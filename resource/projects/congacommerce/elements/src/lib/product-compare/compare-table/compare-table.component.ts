import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { FeatureSet, Feature, Product } from '@congacommerce/ecommerce';
/**
 * The compare table is a table of product features with a product compare card as each column header.
 * @ignore
 */
@Component({
  selector: 'apt-compare-table',
  templateUrl: './compare-table.component.html',
  styleUrls: ['./compare-table.component.scss']
})
/**
 * Compare table component is used to create a table of products to compare features.
 */
export class CompareTableComponent implements OnChanges {
  /**
   * Product array that can be subscribed to for creating the columns.
   */
  @Input() products: Array<Product>;
  /**
   * Array of features between all products
   */
  features: Array<Feature> = [];
  /**
   * Object used to set the min-width style property for the table based on the number of columns.
   */
  widths = {
    2: '600px',
    3: '800px',
    4: '1000px',
    5: '1200px'
  };
  /**
   * Data used to populate the cells in the table.
   */
  tableData: Array<FeatureTableData> = [];
  /**
   * @ignore
   */
  ngOnChanges() {
    if (this.products) {
      const allFeatureSets = [];
      const allFeatures = [];
      this.products.forEach(product => {
        product.ProductFeatureValues.forEach(productFeature => {
          allFeatureSets.push(productFeature.Feature.FeatureSet);
          allFeatures.push(productFeature.Feature);
        });
      });
      this.features = _.uniqBy(allFeatures, 'Id');
      // Before any new change clear out existing array of featureSet
      this.tableData = new Array<FeatureTableData>();
      _.uniqBy(allFeatureSets, 'Id').forEach(featureSet => {
        this.tableData.push({
          featureSet: featureSet,
          featuresInSet: this.featuresInSet(featureSet).map(feature => {
            return {
              feature: feature,
              featureValuePerProduct: this.products.map(product => {
                return this.featureValue(product, feature);
              })
            };
          })
        });
      });
    }
  }
  /**
   * Gets the features that are in the given FeatureSet object.
   * @param featureSet Feature set to check against.
   * @returns Array<Feature> representing Array of features between products
   */
  featuresInSet(featureSet: FeatureSet): Array<Feature> {
    const featuresInSet = [];
    this.features.forEach(feature => {
      if (feature.FeatureSet.Id === featureSet.Id) featuresInSet.push(feature);
    });
    return featuresInSet;
  }
  /**
   * Gets the value of a given feature on a given product.
   * @param product Product to check for feature values.
   * @param feature Feature to get value of.
   * @returns the value of a given feature on a given product
   */
  featureValue(product: Product, feature: Feature): string {
    let value = 'n/a';
    product.ProductFeatureValues.forEach(productFeatureValue => {
      if (productFeatureValue.Feature.Id === feature.Id) value = productFeatureValue.Value;
    });
    return value;
  }

}

/** @ignore */
interface FeatureTableData {
  featureSet: FeatureSet;
  featuresInSet: Array<ProductFeatureValue>;
}

/** @ignore */
interface ProductFeatureValue {
  feature: Feature;
  featureValuePerProduct: Array<string>;
}

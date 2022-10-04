/** The flags which gives info about the configuration changes in product detail page. */
export interface ConfigurationFlags {
  /** boolean value is to true if there is change in options */
  optionChanged: boolean;
  /** boolean value is to true if there is change in attributes */
  attributeChanged: boolean;
}
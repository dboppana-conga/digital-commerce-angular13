/**
 * Batch Action model describes a batch action object. Batch actions are actions that can be taken on several selected items.
 */
export class BatchAction {
  /**
   * The label to display for the action in the UI.
   */
  private displayLabel: string;
  /**
   * Open Iconic icon name that is shown with the display label.
   */
  private iconName: string;
  /**
   * The method that is fired when this action is triggered.
   */
  private actionMethod: Function;
  /**
   * Determines if this action should be disabled.
   */
  private disabled: boolean = true;
  /**
   * Determines if this action should be visible.
   */
  private visible: boolean = true;
  /**
   * The tooltip text to show on disabled actions.
   */
  private tooltipText: string = 'Action Disabled';
  /**
   * Creates a new batch action object with the given parameters.
   * @param displayLabel The string value to show on the display label.
   * @param iconName The Open Iconic icon name shown on with the display label.
   * @param actionMethod The method that is fired when this action is triggered.
   */
  constructor(
    displayLabel: string,
    iconName: string,
    actionMethod: Function
  ) {
    this.displayLabel = displayLabel;
    this.iconName = iconName;
    this.actionMethod = actionMethod;
  }
  /**
   * Gets the display name for this batch action.
   */
  public getDisplayName(): string {
    return this.displayLabel;
  }

  public getTranslationKey(): string {
    if (this.displayLabel === 'Compare')
      return 'COMMON.COMPARE';
    else if (this.displayLabel === 'Renew')
      return 'COMMON.RENEW';
    else if (this.displayLabel === 'Terminate')
      return 'COMMON.TERMINATE';
    else if (this.displayLabel === 'Save Favorite')
      return 'COMMON.SAVE_FAVORITE';
    else if (this.displayLabel === 'Clone')
      return 'COMMON.CLONE';
  }

  /**
   * Gets the Open Iconic icon name for this batch action.
   */
  public getIconName(): string {
    return this.iconName;
  }
  /**
   * Gets the action method for this batch action.
   */
  public getActionMethod(): Function {
    return this.actionMethod;
  }
  /**
   * Gets the disabled state of this batch action.
   */
  public isDisabled(): boolean {
    return this.disabled;
  }
  /**
    * Gets the visible state of this batch action.
  */
  public isVisible(): boolean {
    return this.visible;
  }
  /**
   * Setter for the disabled state of this batch action.
   * @param disabled Disabled state of this batch action.
   */
  public setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
* Setter for the visible state of this batch action.
* @param visible Visible state of this batch action.
*/
  public setVisible(visible: boolean) {
    this.visible = visible;
  }

  /**
   * Gets the tooltip text for this batch action.
   */
  public getTooltipText(): string {
    return this.tooltipText;
  }
  /**
   * Sets the tooltip text on this batch action when it is disabled.
   * @param text Text to display on the tooltip.
   */
  public setTooltipText(text: string) {
    this.tooltipText = text;
  }

}
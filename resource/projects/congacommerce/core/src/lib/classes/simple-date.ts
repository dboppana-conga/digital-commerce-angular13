export class SimpleDate {

  private value: Date;

  constructor(value: Date) {
    this.value = value;
  }

  public setDate(value: Date) {
    this.value = value;
  }

  getSimpleDate(): string {
    return this.value.toISOString().substr(0, 10);
  }
}

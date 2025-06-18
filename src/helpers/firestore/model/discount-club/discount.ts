export class Discount {

  constructor(
    id: string,
    purchaseStepValue: number,
    discountPerStepValue: number,
    enabled: boolean = false
  ) {
    this.id = id;
    this._purchaseStepValue = purchaseStepValue;
    this._discountPerStepValue = discountPerStepValue;
    this._enabled = enabled;
  }

  id: string;

  private readonly _purchaseStepValue: number;
  private readonly _discountPerStepValue: number;
  private _enabled: boolean;

  get purchaseStepValue(): number {
    return this._purchaseStepValue;
  }

  get discountPerStepValue(): number {
    return this._discountPerStepValue;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  toJson() {
    return {
      id: this.id,
      purchaseStepValue: this._purchaseStepValue,
      discountPerStepValue: this._discountPerStepValue,
      enabled: this._enabled,
    };
  }
}

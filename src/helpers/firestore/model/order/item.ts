import { BaseModel } from "@/helpers/firestore/model/baseModel";
import { Product } from "@/helpers/firestore/model/product/product";

export default class Item implements BaseModel {
  constructor(id: string, product: Product, quantity: number, value: number) {
    this.id = id;
    this._product = product;
    this._quantity = quantity;
    this._value = value;
  }

  readonly id: string;
  private readonly _product: Product;
  private readonly _quantity: number;
  private readonly _value: number;

  get product() {
    return this._product;
  }

  get quantity() {
    return this._quantity;
  }

  get value() {
    return this._value;
  }

  toJson() {
    return {
      id: this.id,
      product: this._product.toJson(),
      quantity: this._quantity,
      value: this._value,
    };
  }
}

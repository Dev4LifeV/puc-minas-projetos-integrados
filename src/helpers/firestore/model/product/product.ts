import { Category } from "../../model/product/category";
import { BaseModel } from "../baseModel";

export class Product implements BaseModel {
  constructor(
    id: string,
    description: string,
    value: number,
    category: Category,
    inventory: number,
    image?: string
  ) {
    this.id = id;
    this._image = image;
    this._description = description;
    this._value = value;
    this._category = category;
    this._inventory = inventory;
  }

  readonly id: string;

  private readonly _image?: string;
  public get image(): string | undefined {
    return this._image;
  }

  private readonly _description: string;
  public get description(): string {
    return this._description;
  }

  private readonly _value: number;
  public get value(): number {
    return this._value;
  }

  private readonly _category: Category;
  public get category(): Category {
    return this._category;
  }

  private _inventory: number;
  public get inventory(): number {
    return this._inventory;
  }

  public set inventory(value: number) {
    this._inventory = value;
  }

  toJson() {
    if (this._image !== undefined) {
      return {
        id: this.id,
        category: this._category.toJson(),
        description: this._description,
        image: this._image,
        value: this._value,
        inventory: +this._inventory,
      };
    }
    return {
      id: this.id,
      category: this._category.toJson(),
      description: this._description,
      value: this._value,
      inventory: +this._inventory,
    };
  }
}

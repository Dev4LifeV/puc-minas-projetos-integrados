import { BaseModel } from "../baseModel";

export class Category implements BaseModel {
  constructor(id: string, name: string) {
    this.id = id;
    this._name = name;
  }

  readonly id: string;

  readonly _name: string;
  public get name(): string {
    return this._name;
  }

  toJson() {
    return {
      id: this.id,
      name: this._name,
    };
  }
}

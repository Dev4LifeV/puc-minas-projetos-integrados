import { BaseModel } from "@/helpers/firestore/model/baseModel";

export class MinimumOrder implements BaseModel {
  constructor(id: string, minimumOrderValue: number) {
    this.id = id;
    this._minimumOrderValue = minimumOrderValue;
  }

  id: string;

  get minimumOrderValue(): number {
    return this._minimumOrderValue;
  }

  private readonly _minimumOrderValue: number;

  toJson() {
    return {
      minimumOrderValue: this._minimumOrderValue,
    };
  }
}

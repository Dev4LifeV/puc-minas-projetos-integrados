import { BaseModel } from "../baseModel";

export default class Neighborhood implements BaseModel {
  constructor(id: string, neighborhoodName: string, freightCost: number) {
    this.id = id;
    (this._freightCost = freightCost),
      (this._neighborhoodName = neighborhoodName);
  }

  readonly id: string;

  private readonly _neighborhoodName?: string;
  public get neighborhoodName(): string | undefined {
    return this._neighborhoodName;
  }

  private readonly _freightCost?: number | undefined;
  public get freightCost(): number | undefined {
    return this._freightCost;
  }

  toJson() {
    return {
      id: this.id,
      neighborhoodName: this._neighborhoodName,
      freightCost: this._freightCost,
    };
  }
}

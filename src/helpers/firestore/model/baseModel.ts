export interface BaseModel {
  id: string;

  toJson: () => Object;
}

import { BaseModel } from "../baseModel";

export default class Campaign implements BaseModel {
  constructor(id: string, campaignDownloadUrl?: string) {
    this.id = id;
    this._campaignDownloadUrl = campaignDownloadUrl;
  }

  readonly id: string;

  private readonly _campaignDownloadUrl?: string;
  public get campaignDownloadUrl(): string | undefined {
    return this._campaignDownloadUrl;
  }

  toJson() {
    return {
      id: this.id,
      campaignDownloadUrl: this._campaignDownloadUrl,
    };
  }
}

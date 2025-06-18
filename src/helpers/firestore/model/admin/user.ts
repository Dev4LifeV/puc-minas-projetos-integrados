import { BaseModel } from "../baseModel";

export class User implements BaseModel {
  constructor(id: string, email: string, userName: string, isAdmin?: boolean) {
    this.id = id;
    this._email = email;
    this._userName = userName;
    this._isAdmin = isAdmin ?? false;
  }

  id: string;
  private readonly _email: string;
  private readonly _userName: string;
  private readonly _isAdmin: boolean;

  get email() {
    return this._email;
  }

  get userName() {
    return this._userName;
  }

  get isAdmin() {
    return this._isAdmin;
  }

  toJson() {
    return {
      id: this.id,
      email: this._email,
      isAdmin: this._isAdmin,
      name: this._userName,
    };
  }
}

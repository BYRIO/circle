import {
  Allow,
  IsAlphanumeric,
  IsEmail,
  IsUrl,
  IsUUID,
  Length,
  Matches,
} from "class-validator";

import {BaseModel} from "./base";
export class User extends BaseModel {
  @IsUUID("4") public id?: string;

  @IsEmail({}, { groups: ["register", "login", "reset"], message: "Not a valid email." })
  public email?: string;

  @Length(8, 50, {groups: ["register", "login"]})
  public password?: string;

  @Matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
    groups: ["register", "reset"],
    message: "Illegal.",
  })
  public username?: string;

  @Length(1, 40, {
    groups: ["register"],
    message: "Illegal.",
  })
  public nickname?: string;

  @IsUrl({}, { groups: ["register"], message: "Illegal URL." })
  public avatar?: string;
  public created?: Date;
  public updated?: Date;
  public deleted?: Date;
}

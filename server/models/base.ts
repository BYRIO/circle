import { validate } from "class-validator";
export class BaseModel {
  constructor(obj) {
    Object.assign(this, obj);
  }
  public validate(groups: string[]) {
    return validate(this, {
      groups,
      "forbidUnknownValues": true,
      "validationError": {
        "target": false,
        "value": false,
      },
    });
  }
}

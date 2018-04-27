import { ValidationError } from "class-validator";

function first(obj: { [type: string]: string }) {
  for (const k in obj) {
    if (true) { return obj[k]; }
  }
}

export class ReasonableError extends Error {
  public static fromValidationError(errors: ValidationError[]) {
    const texts = errors.map(
      ({ property, constraints }) => `[${property}]${first(constraints)}`,
    );
    return new ReasonableError(texts.join("\n"));
  }
  public msg: string;
  public data: any;

  constructor(msg) {
    super(msg);
    this.msg = msg;
  }

}

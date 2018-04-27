import * as Koa from "koa";
import { ReasonableError } from "../utils/reasonable-error";

function parse(obj: object | ReasonableError) {
  if (obj instanceof ReasonableError) {
    if (obj.data) {
      return { ok: false, err: obj.msg, data: obj.data };
    } else {
      return { ok: false, err: obj.msg };
    }
  } else {
    if (obj) {
      return { ok: true, data: obj };
    } else {
      return { ok: true };
    }
  }
}

const middleware: Koa.Middleware = async (ctx, next) => {
  await next();
  if (ctx.ok) { ctx.body = parse(ctx.ok); }
};
export default middleware;

require("dotenv").config();

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { koaLogger } from "koa-log4";
import * as log4js from "log4js";
import okMiddleware from "./middlewares/ok";
import routes from "./routes/v1";

log4js.configure({
  appenders: { cheese: { type: "stdout" } },
  categories: { default: { appenders: ["cheese"], level: "info" } },
});

const app = new Koa();

app.use(koaLogger(log4js.getLogger("http"), { level: "auto" }));
app.use(bodyParser({ enableTypes: ["json"] }));
app.use(okMiddleware);

app.use(routes);

app.listen(process.env.SERVER_PORT || 3000);

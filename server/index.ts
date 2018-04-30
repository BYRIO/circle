require("dotenv").config();

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { koaLogger } from "koa-log4";
import * as log4js from "log4js";
import okMiddleware from "./middlewares/ok";
import routes from "./routes/v1";
import {Schema} from './schema';
import * as graphqlHTTP from 'koa-graphql';
import * as Router  from "koa-router";
import * as jwt from "jsonwebtoken";
log4js.configure({
  appenders: { cheese: { type: "stdout" } },
  categories: { default: { appenders: ["cheese"], level: "info" } },
});

const app = new Koa();

app.use(koaLogger(log4js.getLogger("http"), { level: "auto" }));
app.use(bodyParser({ enableTypes: ["json"] }));
app.use(okMiddleware);

app.use(routes);

const graphqlRouter = new Router();
graphqlRouter.all("/graphql",graphqlHTTP(async(ctx,next)=>({
  schema:Schema,
  graphiql:true,
  rootValue: {
    me:()=>(jwt.verify(ctx.headers['authorization'],process.env["JWT_SECRET"]) as {id:string}).id
  },
  context:ctx.headers
})));
app.use(graphqlRouter.routes());

app.listen(process.env.SERVER_PORT || 3000);

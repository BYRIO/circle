import * as Router from "koa-router";
import userRoutes from "./user";

const router = new Router({
  prefix: "/api/v1"
});

router.use(userRoutes);

export default router.routes();

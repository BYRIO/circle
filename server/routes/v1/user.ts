import * as Router from "koa-router";
import {
  applyResetPassword,
  confirmEmail,
  doResetPassword,
  login,
  refreshToken,
  register,
  sendEmail,
} from "../../controllers/user";
import { User } from "../../models/user";
const router = new Router();

/* 用户注册
Request:
POST /api/v1/users HTTP/1.1
Content-Type: application/json

{
	"email":"example@example.com",
	"username":"example",
	"nickname":"example",
	"avatar":"http://example.com/example.png",
	"password":"example123"
}
Response<200>:
{
    "ok": true,
    "data": {
        "id": "2849898b-9374-4a64-91a0-d4ff4a1a3753",
        "email": "example@example.com",
        "username": "example",
        "nickname": "example",
        "avatar": "http://example.com/example.png",
        "created": "2018-04-27T13:26:20.000Z",
        "updated": "2018-04-27T13:26:20.000Z"
    }
}

OR:
{
    "ok": false,
    "err": "Username exists."
}
 */
router.post("/users", async (ctx, next) => {
  ctx.ok = await register(new User(ctx.request.body));
});

/* 用户登录
Request:
POST /api/v1/user/login HTTP/1.1
Content-Type: application/json

{
	"email":"example@example.com",
	"password":"example123"
}
Response<200>:
{
    "ok": false,
    "err": "Email unconfirmed.",
    "data": {
        "resend": "http://localhost:3000/api/v1/user/email/resend?token=...k"
    }
}

OR:
{
    "ok": false,
    "err": "[password]wrong password."
}

OR:
{
    "ok": true,
    "data": {
        "token": "eyJhbGci....7w",
        "refresh_token": "eyJhbGciOiJIUzI....w0l6pfA"
    }
}
 */
router.post("/user/login", async (ctx, next) => {
  ctx.ok = await login(new User(ctx.request.body));
});

/* 刷新token
Request:
GET /api/v1/user/refresh?token=<refresh_token> HTTP/1.1

Response<200>:
{
    "ok": true,
    "data": {
        "token": "...",
        "refresh_token": "..."
    }
}

OR:
{
    "ok": false,
    "err": "Bad token"
}
 */
router.get("/user/refresh", async (ctx, next) => {
  ctx.ok = await refreshToken(ctx.query.token);
});

/* 找回密码
Request:
POST /api/v1/user/reset_password/apply HTTP/1.1
Content-Type: application/json

{
	"email":"example@example.com",
	"username":"example"
}

Response<200>:
{
    "ok": true,
    "data": {
        "sendto": "example@example.com"
    }
}
OR:
{
    "ok": false,
    "err": "Invaild username or email."
}
*/
router.post("/user/reset_password/apply", async (ctx, next) => {
  ctx.ok = await applyResetPassword(new User(ctx.request.body));
});

/* 重置密码
Request:
POST /api/v1/user/reset_password/confirm HTTP/1.1
Content-Type: application/json

{
	"token":"<token from reset_password/apply>",
	"password":"ddddddd33rf4"
}

Response<200>:
{
    "ok": true,
    "data": {
        "reset": "d0d5b9ea-3654-40c8-bb89-8ce61450d687"
    }
}
OR:
{
    "ok": false,
    "err": "Bad token."
}
*/
router.post("/user/reset_password/confirm", async (ctx, next) => {
  ctx.ok = await doResetPassword(
    ctx.request.body.token,
    ctx.request.body.password,
  );
});
/* 重发验证邮件
Request:
GET /api/v1/user/email/resend?token=<token here> HTTP/1.1

Response<200>:
{
    "ok": true,
    "data": {
        "sendto": "example@example.com"
    }
}

OR:
{
    "ok": false,
    "err": "Bad token"
}
*/
router.get("/user/email/resend", async (ctx, next) => {
  ctx.ok = await sendEmail(ctx.query.token);
});
/* 验证邮箱
Request:
GET /api/v1/user/email/confirm?token=<token from resend> HTTP/1.1

Response<200>:
{
    "ok": true,
    "data": {
        "confirmed_user_id": "d0d5b9ea-3654-40c8-bb89-8ce61450d687"
    }
}

OR:
{
    "ok": false,
    "err": "Bad token"
}
*/
router.get("/user/email/confirm", async (ctx, next) => {
  ctx.ok = await confirmEmail(ctx.query.token);
});

export default router.routes();

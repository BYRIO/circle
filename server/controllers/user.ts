import { validate } from "class-validator";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { getLogger } from "log4js";
import * as PasswordValidator from "password-validator";
import { UNIQUE_VIOLATION } from "pg-error-constants";
import { Query } from "../db";
import { User } from "../models/user";
import { ReasonableError } from "../utils/reasonable-error";
import { sendConfirmEmail } from "../utils/sendmail";
const logger = getLogger("UserModel");

const passwordSchema = new PasswordValidator();
const RETURNING_FIELD = "id,email,username,nickname,avatar,created,updated";
const JWT_SECRET = process.env.JWT_SECRET;
const APP_URL = process.env.APP_URL;
passwordSchema
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .letters()
  .has()
  .digits();

function encryptPassword(password, salt) {
  try {
    return crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex");
  } catch (err) {
    logger.error(err);
    return "";
  }
}
function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + "";
}

export async function register(user: User) {
  const errors = await user.validate(["register"]);
  if (errors.length > 0) { return ReasonableError.fromValidationError(errors); }
  if (!passwordSchema.validate(user.password || "")) {
    return new ReasonableError("Password is too simple");
  }
  const salt = makeSalt();
  try {
    const result = await Query(
      `WITH inserted AS ( INSERT INTO users VALUES (default,$1,$2,$3,$4,$5,$6) \
      RETURNING ${RETURNING_FIELD}) SELECT * FROM inserted;`,
      [
        user.email,
        user.username,
        user.nickname,
        user.avatar,
        encryptPassword(user.password, salt),
        salt,
      ],
    );
    _sendEmail(result.rows[0].id, user.email).then();
    return result.rows[0];
  } catch (err) {
    const { constraint, code } = err;
    if (code === UNIQUE_VIOLATION) {
      if (constraint === "users_username_key") {
        return new ReasonableError("Username exists.");
      } else if (constraint === "users_unique_lower_idx") {
        return new ReasonableError("Email exists.");
      }
    }
    logger.error(err);
    throw err;
  }
}

async function _sendEmail(id, email) {
  const confirmToken = jwt.sign({ confirm_id: id }, JWT_SECRET, {
    expiresIn: "24h",
  });
  return await sendConfirmEmail(
    email,
    `${APP_URL}/api/v1/user/confirm?token=${confirmToken}`,
  );
}

export async function sendEmail(token: string) {
  try {
    const { sendto } = jwt.verify(token, JWT_SECRET) as { sendto: string };
    let result = await Query(
      "select id,email,email_confirmed from users where id = $1 and deleted is null",
      [sendto],
    );
    const { id, email, email_confirmed } = result.rows[0];
    if (email_confirmed) { throw new Error(`User(${id}) already confirmed.`); }
    result = await _sendEmail(id, email);
    return { sendto: email };
  } catch (err) {
    logger.error(err);
    return new ReasonableError("Bad token");
  }
}

export async function confirmEmail(token: string) {
  try {
    const { confirm_id } = jwt.verify(token, JWT_SECRET) as {
      confirm_id: string;
    };
    let result = await Query(
      "select email_confirmed from users where id = $1 and deleted is null",
      [confirm_id],
    );
    console.log(result.rows[0],jwt.verify(token, JWT_SECRET));
    const { email_confirmed } = result.rows[0];
    if (email_confirmed) { throw new Error(`User(${confirm_id}) already confirmed.`); }
    result = await Query(
      "update users set email_confirmed = true where id = $1",
      [confirm_id],
    );
    return { confirmed_user_id: confirm_id };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return new ReasonableError("Token expired");
    }
    logger.error(err);
    return new ReasonableError("Bad token");
  }
}
function makeToken(id) {
  return {
    token: jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" }),
    refresh_token: jwt.sign({ refresh_id: id }, JWT_SECRET, {
      expiresIn: "48h",
    }),
  };
}
export async function login(user: User) {
  const errors = await user.validate(["login"]);
  if (errors.length > 0) { return ReasonableError.fromValidationError(errors); }
  try {
    const result = await Query(
      `SELECT id,password_hashed,password_salt,email_confirmed FROM users WHERE email = $1 and deleted is null;`,
      [user.email],
    );
    if (result.rowCount === 0) { return new ReasonableError("User not found."); }
    const {
      id,
      password_hashed,
      password_salt,
      email_confirmed,
    } = result.rows[0];
    if (encryptPassword(user.password, password_salt) === password_hashed) {
      if (email_confirmed) {
        return makeToken(id);
      } else {
        const err = new ReasonableError("Email unconfirmed.");
        const token = jwt.sign({ sendto: id }, JWT_SECRET, { expiresIn: "1h" });
        err.data = {
          resend: APP_URL + "/api/v1/user/email/resend?token=" + token,
        };
        return err;
      }
    } else {
      return new ReasonableError("[password]wrong password.");
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export async function applyResetPassword(user: User) {
  const errors = await user.validate(["reset"]);
  if (errors.length > 0) { return ReasonableError.fromValidationError(errors); }
  try {
    let result = await Query(
      "select id,password_salt from users where username = $1 and email = $2 \
      and email_confirmed is true and deleted is null",
      [user.username, user.email],
    );
    if (result.rowCount === 0) {
      return new ReasonableError("Invaild username or email.");
    }
    const { id, password_salt } = result.rows[0];
    const resetToken = jwt.sign(
      { reset_id: id, s: encryptPassword(password_salt, password_salt) },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    result = await sendConfirmEmail(
      user.email,
      `${APP_URL}/api/v1/user/reset_password/confirm?token=${resetToken}`,
    );
    return { sendto: user.email };
  } catch (err) {
    logger.error(err);
    return new ReasonableError("Invaild username or email.");
  }
}

export async function doResetPassword(token: string, password: string) {
  if (!passwordSchema.validate(password || "")) {
    return new ReasonableError("Password is too simple");
  }
  try {
    const { reset_id, s } = jwt.verify(token, JWT_SECRET) as {
      reset_id: string;
      s: string;
    };
    let result = await Query("select password_salt from users where id = $1", [
      reset_id,
    ]);
    const old_salt = result.rows[0].password_salt;
    if (encryptPassword(old_salt, old_salt) !== s) { throw new Error("Used token"); }
    const password_salt = makeSalt();
    const password_hashed = encryptPassword(password, password_salt);
    result = await Query(
      "update users set password_salt = $1 , password_hashed = $2 where id = $3;",
      [password_salt, password_hashed, reset_id],
    );
    return { reset: reset_id };
  } catch (err) {
    logger.error(err);
    return new ReasonableError("Bad token.");
  }
}

export async function refreshToken(token: string) {
  try {
    const { refresh_id } = jwt.verify(token, JWT_SECRET) as {
      refresh_id: string;
    };
    return makeToken(refresh_id);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return new ReasonableError("Token expired");
    }
    logger.error(err);
    return new ReasonableError("Bad token");
  }
}

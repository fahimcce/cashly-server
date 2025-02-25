import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,

  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRE_IN,

  jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  // reset_token: process.env.RESET_TOKEN,
  // reset_expires_in: process.env.RESET_EXPIRES_IN,
  // reset_link: process.env.RESET_LINK,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  // sender_mail: process.env.MAIL_SENDER_EMAIL,
  // sender_password: process.env.MAIL_SENDER_PASSWORD,
};

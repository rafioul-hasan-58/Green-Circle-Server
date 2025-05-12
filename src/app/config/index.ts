import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  email: process.env.EMAIL,
  app_password: process.env.APP_PASSWORD,
  reset_password_secret: process.env.RESET_PASS_SECRET,
  reset_password_expires_in: process.env.RESET_PASS_EXPIRES_IN,
  reset_password_link: process.env.RESET_PASS_LINK,
  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
};

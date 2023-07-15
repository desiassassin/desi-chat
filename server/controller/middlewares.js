import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const isUserAuthorized = (req, res, next) => {
     const { accessToken } = req.cookies;

     if (!accessToken) return res.sendStatus(StatusCodes.UNAUTHORIZED);

     try {
          const { _id, username } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
          req.user = { _id, username };
     } catch (error) {
          return res.clearCookie("accessToken").sendStatus(StatusCodes.UNAUTHORIZED);
     }

     next();
};

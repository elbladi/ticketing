import express, { NextFunction, Response, Request } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHanlder, NotFoundError, currentUser } from "@bladtickets/common";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //set cookies when request commes from https
  })
);

app.use(currentUser);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHanlder);

export { app };

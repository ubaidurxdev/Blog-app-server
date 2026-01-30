import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to blog app server");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use(notFound);
app.use(errorHandler);
export default app;

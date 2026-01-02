import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app: Application = express();
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/", async (req, res) => {
  res.send("Hello World");
});
export default app;

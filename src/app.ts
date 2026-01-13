import * as dotenv from 'dotenv';
dotenv.config()
import express, { Application } from 'express';
import { postRouter } from './modules/post/post.route';
import { toNodeHandler } from "better-auth/node"
import { auth } from './lib/auth';
import cors from 'cors'
import { commentRouter } from './modules/comment/comment.route';
import errorHandler from './middleware/globalErrorHandler';

const app: Application = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json());



app.use("/post", postRouter)

app.use("/comment", commentRouter)


app.get("/", async (req, res) => {
    // console.log("Hello World")
    res.send("Hello World")
});

app.use(errorHandler)


export default app;
import express, { Application } from 'express';
import { postRouter } from './modules/post/post.route';

const app: Application = express();

app.use(express.json());
app.use("/post", postRouter)

app.get("/", async (req, res) => {
    // console.log("Hello World")
    res.send("Hello World")
});



export default app;
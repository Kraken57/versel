import express from "express";
import {S3} from "aws-sdk"
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
  });

const app = express();

app.all("/{*splat}", async (req, res) => {
  const host = req.hostname;
  //   console.log("Host:", host)
  const id = host.split(".")[0];
  const filePath = req.path;

  const contents = await s3.getObject({
    Bucket : "vercel-clone",
    Key : `dist/${id}${filePath}`
  }).promise()

  const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
});

app.listen(3001, () => {
  console.log("Server running at port 3001");
});

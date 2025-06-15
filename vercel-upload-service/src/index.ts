import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./generateid";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";

// to initialize a publisher so that wr can put things in redis
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

// uploadFile("dist/output/9g2k6/package.json", "/mnt/c/MYPROJECTS/vercel-clone/dist/output/9g2k6/package.json")

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl; // github repo url
  //   console.log(repoUrl);
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const files = getAllFiles(path.join(__dirname, `output/${id}`));
  // /mnt/c/MYPROJECTS/vercel-clone/dist/output/9g2k6/package.json
  // so basically what .slice() will do is remove the __dirname i.e. /mnt/c/MYPROJECTS/vercel-clone/dist and +1 i.e /
  // so basically it will remove /mnt/c/MYPROJECTS/vercel-clone/dist/ and we are left with this output/9g2k6/package.json
  // output/9g2k6/package.json
  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  // put this to s3
  //   console.log(files);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded"); // similar to INSERT => SQL or .create => MongoDB

  res.json({
    id: id,
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000, () => {
  console.log("Server running at port 3000");
});

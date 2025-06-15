import { createClient } from "redis";
// import { downloadS3Folder, copyFinalDist } from "./s3sync";
// use this if you want the length logic
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./build";

const subscriber = createClient();
const publisher = createClient();

async function main() {
  await subscriber.connect();
  await publisher.connect();
  console.log("🚀 Worker started and waiting for Redis jobs...");

  while (true) {
    const response = await subscriber.brPop("build-queue", 0);
    console.log("📥 Job received:", response);

    if (response) {
      const { element } = response;
      const id = element;

      await downloadS3Folder(`output/${id}`);
      await buildProject(id);
      copyFinalDist(id);
      publisher.hSet("status", id, "deployed");
    }
  }
}

main();

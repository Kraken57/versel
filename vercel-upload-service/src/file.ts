import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
  let response: string[] = [];
  const allFilesAndFolder = fs.readdirSync(folderPath);
  allFilesAndFolder.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
        // not using push here because it will give an array of array 
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

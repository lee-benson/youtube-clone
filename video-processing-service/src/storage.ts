import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// This file keeps track of both local and GCS 

const storage = new Storage();

// The following are the GCS storage variables
const rawVideoBucketName = "blee-yt-raw-videos";
const processedVideoBucketName = "blee-yt-processed-videos";

// The following are the local storage variables
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/* Creates the local directories for the raw and processed videos */

export function setUpDirectories() {
}

/** 
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns - A promise that resolves when the video is converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=trunc(iw/2)*2:360") // 360p (Scale has to be divisible by 2)
      .on("end", () => {
        console.log("Processing finished successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.log(`An error occurred: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - Name of file to be downloaded from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
  await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
  )
}

/**
 * @param fileName - The name of the file to be uploaded from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 *  @returns A promise that resolves when the file has been uploaded.
 * */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`), {
    destination: fileName
  };
  console.log(
    `${localProcessedVideoPath}/${fileName} uploaeded to gs://${processedVideoBucketName}/${fileName}`
  );
  await bucket.file(fileName).makePublic();
}
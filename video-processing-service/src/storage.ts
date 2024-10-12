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
import axios from "axios";
import { api } from "encore.dev/api";
import { transcribeAudio } from "./test.ts";
import * as fs from "fs";
import path from "path";
import {convertToLinuxPath} from "./utils.ts";

interface Response {
  message: string;
}

export const post = api(
  { expose: true, auth: false, method: "POST", path: "/speech" },
  async ({ url }: { url: string }): Promise<Response> => {
    try {
      let audioBytes;

      if (url.startsWith("file://")) {
        let localFilePath = decodeURIComponent(url.replace("file:///", "")); // Remove the file:// part and decode special chars

        localFilePath = convertToLinuxPath(path.normalize(localFilePath));

        // Check if the file exists
        if (!fs.existsSync(localFilePath)) {
          throw new Error(`File not found at ${localFilePath}`);
        } else {
          console.log(`File found at ${localFilePath}`);
        }

        const file = fs.readFileSync(localFilePath);
        audioBytes = file.toString("base64");
      } else if (url.startsWith("http://")) {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });

        audioBytes = Buffer.from(response.data, "binary").toString("base64");
      } else {
        throw new Error("URL is not a local file or local network path");
      }

      console.log("base64", audioBytes);

      const transcription = await transcribeAudio(audioBytes);

      return { message: `Audio file processed successfully: ${transcription}` };
    } catch (error) {
      console.error("Error processing the audio file:", error);
      return { message: "Failed to process audio file" };
    }
  }
);

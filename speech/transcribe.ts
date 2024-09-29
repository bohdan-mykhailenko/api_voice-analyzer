import { google } from "@google-cloud/speech/build/protos/protos";

import fs from "fs";
import path from "path";
import client from "./speechConfig";

export async function transcribeAudio(audioBytes: string) {
  const audio = {
    content: audioBytes,
  };

  console.log("Transcribing audio...", audioBytes);

  const config = {
    //  encoding: google.cloud.speech.v1.RecognitionConfig.AudioEncoding.,
    encoding: "LINEAR16",
    // encoding: "MP3",

    // sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [{ results: recognitionResults }] = await client.recognize(request);

    // recognize(request); // less than 1 minute

    if (recognitionResults) {
      const transcription = recognitionResults
        .map((result) => result.alternatives![0].transcript)
        .join("\n");

      console.log(`Transcription: ${transcription}`);
      return transcription;
    }
  } catch (error: any) {
    throw new Error(`CANT TRANSCRIBE AUDIO: ${error.message}`);
  }
}

export async function transcribeAudioLocal(filePath: string) {
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString("base64");

  const audio = {
    content: audioBytes,
  };

  console.log("Transcribing audio...", audioBytes);

  const config = {
    encoding: 1,
    // sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };
  try {
    const [{ results: recognitionResults }] = await client.recognize(request);

    if (recognitionResults) {
      const transcription = recognitionResults
        .map((result) => result.alternatives![0].transcript)
        .join("\n");

      console.log(`Transcription: ${transcription}`);
      return transcription;
    }
  } catch (error: any) {
    throw new Error(`CANT TRANSCRIBE AUDIO: ${error.message}`);
  }
}

//await transcribeAudioLocal("./speech/audio_2024-09-24_22-08-02.wav");

console.log(fs.existsSync("/mnt/d/Downloads/music.mp3"));

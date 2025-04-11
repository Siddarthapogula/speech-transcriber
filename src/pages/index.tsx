import { use, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import axios from "axios";
import { Languages } from "@/constants";

export default function Home() {
  const [speech, setSpeech] = useState("");
  const [transcribe, setTranscribe] = useState("");
  const [lang, setLang] = useState("English");
  const [userLang, setUserLang] = useState("English");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = (e: any) => {
    setSpeech("");
    resetTranscript();
    e.preventDefault();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = (e: any) => {
    e.preventDefault();
    SpeechRecognition.stopListening();
    setSpeech(transcript);
  };
  useEffect(() => {
    async function getTheTranscribe() {
      setTranscribe(
        (
          await axios.post("/api/get-user-transcribe", {
            speech,
            lang,
            userLang,
          })
        ).data
      );
    }
    getTheTranscribe();
  }, [speech]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Speech Transcriber
        </h2>

        <div className="text-center">
          <p
            className={`text-md font-medium ${
              listening ? "text-green-600" : "text-red-500"
            }`}
          >
            🎙️ Microphone is {listening ? "ON" : "OFF"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Choose Your Language
            </label>
            <select
              onChange={(e) => setUserLang((e as any).target.value)}
              className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              {Languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Output Language
            </label>
            <select
              onChange={(e) => setLang((e as any).target.value)}
              className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              {Languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-500 cursor-pointer hover:bg-green-600 transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
            onClick={startListening}
          >
            Start Listening
          </button>

          <button
            className="bg-red-500 cursor-pointer hover:bg-red-600 transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
            onClick={stopListening}
          >
            Stop Listening
          </button>
        </div>

        <div className="bg-gray-50 border-2 border-blue-500 rounded-xl p-4">
          <p className="text-gray-700 font-medium mb-2">🎧 Your Speech:</p>
          <p className="text-gray-900">{transcript}</p>
        </div>

        <div className="bg-gray-50 border-2 border-blue-500 rounded-xl p-4">
          <p className="text-gray-700 font-medium mb-2">📝 Transcribed Text:</p>
          <p className="text-gray-900">{transcribe}</p>
        </div>
      </div>
    </div>
  );
}

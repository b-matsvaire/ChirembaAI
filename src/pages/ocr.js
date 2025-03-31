import Navbar from "@/components/navabar";
import { useState } from "react";
import { createWorker } from "tesseract.js";

export default function OCR() {
  const [ocrResult, setOcrResult] = useState("");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const worker = await createWorker();
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const { data } = await worker.recognize(reader.result);
        setOcrResult(data.text);
        await worker.terminate();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextToSpeech = (text) => {
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleInputSubmit = () => {
    handleTextToSpeech(inputText);
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setSpeechResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-teal-300 via-green-200 to-green-400 relative text-white font-sans">
      <div>
        <Navbar />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-950">
          OCR Page
        </h1>
        <p className="text-xl text-gray-800">
          This is a placeholder for OCR functionality.
        </p>
        <div className="flex items-center w-full max-w-lg pt-4">
          <input
            type="text"
            placeholder="Enter text for OCR..."
            value={inputText}
            onChange={handleInputChange}
            className="flex-grow py-3 px-4 bg-neutral-800 rounded-l-full focus:outline-none text-white"
          />
          <button
            onClick={handleInputSubmit}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-r-full hover:from-blue-600 hover:to-indigo-600 transition"
          >
            Submit
          </button>
        </div>
        <div className="flex items-center w-full max-w-lg pt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-grow py-3 px-4 bg-neutral-800 rounded-l-full focus:outline-none text-white"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-r-full hover:from-blue-600 hover:to-indigo-600 transition">
            Upload Image
          </button>
        </div>
        <div className="flex items-center w-full max-w-lg pt-4">
          <button
            onClick={handleVoiceInput}
            className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full hover:from-blue-600 hover:to-indigo-600 transition ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? "Listening..." : "Start Voice Input"}
          </button>
        </div>
        {speechResult && (
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-slate-950">Speech Result:</h2>
            <p className="text-lg text-gray-800">{speechResult}</p>
          </div>
        )}
        {ocrResult && (
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-slate-950">OCR Result:</h2>
            <p className="text-lg text-gray-800">{ocrResult}</p>
            <button
              onClick={() => handleTextToSpeech(ocrResult)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full hover:from-blue-600 hover:to-indigo-600 transition"
            >
              Read Aloud
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

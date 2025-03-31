import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { createWorker } from "tesseract.js";
import Navbar from "@/components/navbar";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your personal AI Assistant Doctor.",
      timestamp: "10:25",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");

  const sampleQuestions = [
    "What are the symptoms of pneumonia?",
    "How can I manage sugar spikes after dinner?",
    "What are the early signs before heart attack?",
  ];

  const [showSampleQuestions, setShowSampleQuestions] = useState(true);

  const handleSampleQuestionClick = (question) => {
    setInput(question);
    setShowSampleQuestions(false);
  };

  useEffect(() => {
    setIsTyping(!!input.trim());
  }, [input]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        type: "user",
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post("http://127.0.0.1:8001/generate", {
          prompt: `Assume role of Specialist AI Doctor, Provide a short, precise response for the query: ${input.trim()}`,
        });
        const botResponse = {
          type: "bot",
          content: response.data.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const botResponse = {
          type: "bot",
          content: "Sorry, I couldn't process your request at the moment.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const newMessage = {
            type: "user",
            content: reader.result, // Base64 encoded image data
            isImage: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          const worker = await createWorker();
          await worker.load();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          const { data } = await worker.recognize(reader.result);
          const ocrMessage = {
            type: "bot",
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, ocrMessage]);
          await worker.terminate();
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setSpeechResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInput(speechResult); // Set the input value to the speech result
    };

    recognition.start();
  };

  const handleAudioRecord = () => {
    if (isListening) {
      setIsListening(false);
      setInput(speechResult); // Set the input value to the speech result
    } else {
      setSpeechResult("");
      handleVoiceInput();
    }
  };

  const handleTextToSpeech = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Chatbot</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
        <Navbar />

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Chat Container */}
          <div className="max-w-4xl mx-auto">
            {/* Chat Messages */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-md px-6 py-4 rounded-2xl ${
                        message.type === "bot"
                          ? "bg-white/5 border border-white/10 backdrop-blur-sm"
                          : "bg-gradient-to-r from-primary-500 to-accent-500"
                      }`}
                    >
                      {message.isImage ? (
                        <img
                          src={message.content}
                          alt="Uploaded"
                          className="max-w-full rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <p className="text-white">{message.content}</p>
                          <span className="text-xs text-white/50 mt-2">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            {showSampleQuestions && (
              <div className="mb-6">
                <h3 className="text-white/70 text-sm mb-3">Try asking:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestionClick(question)}
                      className="p-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/10 transition-colors duration-200 text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleFileUpload}
                  className="p-2 text-white/70 hover:text-white transition-colors duration-200"
                  title="Upload Image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleAudioRecord}
                  className={`p-2 transition-colors duration-200 ${
                    isListening ? "text-accent-400" : "text-white/70 hover:text-white"
                  }`}
                  title={isListening ? "Stop Recording" : "Start Recording"}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl ${
                    input.trim() && !isLoading
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                      : "bg-white/5 text-white/50"
                  } transition-all duration-200`}
                >
                  {isLoading ? (
                    <svg
                      className="w-6 h-6 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Chatbot;
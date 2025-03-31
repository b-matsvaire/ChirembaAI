import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ModelGarden() {
  // Existing state variables
  const [selectedModel, setSelectedModel] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [aiContent, setAiContent] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // New state variables for session summary
  const [sessionSummaries, setSessionSummaries] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const models = [
    { name: "Pneumonia", endpoint: "http://127.0.0.1:8000/pneumonia_detection" },
    { name: "Brain Tumor", endpoint: "http://127.0.0.1:8000/braintumor_detection" },
    { name: "Skin Cancer", endpoint: "http://127.0.0.1:8000/skincancer_detection" },
    { name: "Skin Infection", endpoint: "http://127.0.0.1:8000/skindisease_classification" },
    { name: "Skin Lesion", endpoint: "http://127.0.0.1:8000/skinlesion_classification" },
    { name: "Diabetic Retinopathy", endpoint: "https://api-inference.huggingface.co/models/retina" },
  ];

  // Fetch available cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCameraId(cameras[0].deviceId); // Default to the first camera
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    };

    fetchCameras();
  }, []);

  // Start/stop camera based on `useCamera` state
  useEffect(() => {
    if (useCamera) {
      startCamera(selectedCameraId);
    } else {
      stopCamera();
    }
  }, [useCamera, selectedCameraId]);

  const startCamera = async (cameraId) => {
    try {
      const constraints = {
        video: { deviceId: cameraId ? { exact: cameraId } : undefined },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Error accessing camera: " + err.message);
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setCameraActive(false);
    }
  };

  const handleCameraChange = (event) => {
    setSelectedCameraId(event.target.value);
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
      const capturedFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      setFile(capturedFile);
      setFileUrl(URL.createObjectURL(capturedFile));
    }, 'image/jpeg');
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setResults(null);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile));
    setResults(null);
  };

  // Cookie handling functions
  const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmit = async () => {
    if (!selectedModel || !file) {
      alert("Please select a model and upload a file.");
      return;
    }

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    const selectedEndpoint = models.find((model) => model.name === selectedModel)?.endpoint;

    try {
      const response = await axios.post(selectedEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      const diagnosisResult = {
        class: result.predicted_class,
        confidence: (result.confidence * 100).toFixed(2) + "%",
      };
      
      setResults(diagnosisResult);
      setSubmitted(true);

      // Add to session summaries
      const username = getCookie('username') || 'Guest';
      const role = getCookie('role') || 'Anonymous';
      
      setSessionSummaries(prev => [...prev, {
        date: getCurrentDate(),
        username,
        role,
        model: selectedModel,
        file: file.name,
        result: diagnosisResult
      }]);
      
    } catch (error) {
      console.error("Error performing diagnosis:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert("An error occurred while performing the diagnosis. Please check your backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAIContent = async (tab) => {
    if (!results) {
      alert("Please run a diagnosis first.");
      return;
    }

    setAiLoading(true);
    setAiContent(null);

    const prompt = tab === "Interpretation" 
      ? `Assume role of Specialist AI Doctor, explain the disease and provide an interpretation for the diagnostic result: ${results.class} with ${results.confidence} confidence in short, patient-friendly way.`
      : `Assume role of Specialist AI Doctor, provide an consultation advise for the diagnostic result: ${results.class} with ${results.confidence} confidence in short, patient-friendly way. Do not prescribe any drug, only ayurvedic or home remedies. If severe, make them consult specialist doctor.`;

    try {
      const response = await axios.post("http://127.0.0.1:8001/generate", { prompt });
      setAiContent(response.data.response);
    } catch (error) {
      console.error("Error fetching AI content:", error);
      alert("Failed to fetch content from AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCaptureModeToggle = (useCam) => {
    setUseCamera(useCam);
    setFile(null);
    setFileUrl(null);
  };

  const handleBack = () => {
    setSubmitted(false);
    setResults(null);
    setFile(null);
    setFileUrl(null);
    setAiContent(null);
    setActiveTab(null);
    if (useCamera) {
      stopCamera();
      startCamera(selectedCameraId);
    }
  };

  const specialists = [
    {
      name: "Dr. James Wilson",
      specialty: "Cardiologist",
      experience: "15+ years",
      availability: "Mon-Fri",
      image: "❤️",
      description: "Specialist in cardiovascular health and heart disease prevention",
    },
    {
      name: "Dr. Lisa Chen",
      specialty: "Neurologist",
      experience: "12+ years",
      availability: "Tue-Sat",
      image: "🧠",
      description: "Expert in neurological disorders and brain health",
    },
    {
      name: "Dr. David Smith",
      specialty: "Pediatrician",
      experience: "10+ years",
      availability: "Mon-Thu",
      image: "👶",
      description: "Specialized in child healthcare and development",
    },
    {
      name: "Dr. Maria Rodriguez",
      specialty: "Dermatologist",
      experience: "8+ years",
      availability: "Wed-Sun",
      image: "🧬",
      description: "Expert in skin conditions and treatments",
    },
    {
      name: "Dr. John Parker",
      specialty: "Orthopedist",
      experience: "14+ years",
      availability: "Mon-Fri",
      image: "🦴",
      description: "Specialist in bone and joint conditions",
    },
    {
      name: "Dr. Sarah Thompson",
      specialty: "Psychiatrist",
      experience: "11+ years",
      availability: "Tue-Sat",
      image: "🧪",
      description: "Mental health and behavioral therapy specialist",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Garden of Diagnostic Models</h1>
        <div className={`grid gap-8 ${submitted ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Left Section */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div>
              <label htmlFor="model" className="block text-slate-300 font-semibold mb-2">
                Select a Model and Capture/Upload Image:
              </label>
              <select
                className="w-full p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleModelChange}
                value={selectedModel}
              >
                <option value="" className="text-gray-800">Select a Model</option>
                {models.map((model, index) => (
                  <option key={index} value={model.name} className="text-gray-800">
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Capture Mode Toggle */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleCaptureModeToggle(false)}
                className={`px-4 py-2 font-bold ${
                  !useCamera ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white" : "bg-white/10 backdrop-blur-sm text-slate-300"
                }`}
              >
                Upload Image
              </Button>
              <Button
                onClick={() => handleCaptureModeToggle(true)}
                className={`px-4 py-2 font-bold ${
                  useCamera ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white" : "bg-white/10 backdrop-blur-sm text-slate-300"
                }`}
              >
                Use Camera
              </Button>
            </div>

            {/* Camera Selection Dropdown */}
            {useCamera && (
              <div>
                <label htmlFor="camera-select" className="block text-slate-300 font-semibold mb-2">
                  Select Camera:
                </label>
                <select
                  id="camera-select"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleCameraChange}
                  value={selectedCameraId}
                >
                  {availableCameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId} className="text-gray-800">
                      {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File Upload/Camera Preview */}
            <Card className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {useCamera ? "Camera Capture" : "Upload Image"}
                </h2>
                <div className="relative">
                  {useCamera ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        {fileUrl && (
                          <div className="absolute inset-0">
                            <img
                              src={fileUrl}
                              alt="Captured"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={captureImage}
                          disabled={!cameraActive || fileUrl}
                          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                        >
                          Capture Photo
                        </Button>
                        {fileUrl && (
                          <Button
                            onClick={() => {
                              setFileUrl(null);
                              setFile(null);
                            }}
                            className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
                          >
                            Retake
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    !fileUrl ? (
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-12 h-12 mb-4 text-white/50"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-white/70">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-white/50">PNG, JPG or JPEG</p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden">
                        <img
                          src={fileUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setFileUrl(null);
                            setFile(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedModel || !file || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </Card>
          </div>

          {/* Right Section */}
          {submitted && (
            <div className="space-y-6">
              {/* Back Button */}
              <Button
                onClick={handleBack}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
              >
                Back to Diagnosis
              </Button>

              {/* Diagnosis Results */}
              {results && (
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Diagnosis Results</h2>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-slate-300">Predicted Class:</span>
                      <span className="font-bold text-white">{results.class}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Confidence:</span>
                      <span className="font-bold text-white">{results.confidence}</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Interpretation/Consultation Tabs */}
              <div>
                <div className="flex border-b border-white/20">
                  <Button
                    className={`px-4 py-2 font-bold ${
                      activeTab === "Interpretation" ? "text-white border-b-2 border-blue-500" : "text-slate-300"
                    }`}
                    onClick={() => { setActiveTab("Interpretation"); fetchAIContent("Interpretation"); }}
                  >
                    Interpretation
                  </Button>
                  <Button
                    className={`px-4 py-2 font-bold ${
                      activeTab === "Consultation" ? "text-white border-b-2 border-blue-500" : "text-slate-300"
                    }`}
                    onClick={() => { setActiveTab("Consultation"); fetchAIContent("Consultation"); }}
                  >
                    Consultation
                  </Button>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 mt-4">
                  {aiLoading ? (
                    <p className="text-slate-300">Loading...</p>
                  ) : aiContent ? (
                    <p className="text-slate-300">{aiContent}</p>
                  ) : (
                    <p className="text-slate-300">Select a tab to view content.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Session Summary Section */}
        <div className="mt-8">
          <Button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
          >
            {showSummary ? 'Hide Session Summary' : 'View Session Summary'}
          </Button>

          {showSummary && (
            <div className="mt-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white">Session Summary</h3>
                <p className="text-slate-300 text-sm">
                  Date: {getCurrentDate()}
                </p>
                <p className="text-slate-300 text-sm">
                  Username: {getCookie('username') || 'Guest'} ({getCookie('role') || 'Anonymous'})
                </p>
              </div>

              {sessionSummaries.length === 0 ? (
                <p className="text-slate-300 text-center">No diagnoses made yet</p>
              ) : (
                sessionSummaries.map((summary, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 mb-4">
                    <div className="text-slate-300 space-y-2">
                      <p><span className="font-semibold">Session {index + 1}:</span></p>
                      <p>Model Used: {summary.model}</p>
                      <p>File: {summary.file}</p>
                      <p>Predicted Class: {summary.result.class}</p>
                      <p>Confidence: {summary.result.confidence}</p>
                    </div>
                  </div>
                ))
              )}
              <p className="text-slate-400 text-xs text-center mt-4">
                Note: This summary is temporary and will be cleared when you leave the page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
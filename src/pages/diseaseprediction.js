import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import Navbar from "@/components/navbar";

export default function DiseasePrediction() {
  const [symptom, setSymptom] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [sessionSummaries, setSessionSummaries] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

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

  const handleAddSymptom = () => {
    if (symptom.trim() && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setSymptom("");
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((s) => s !== symptomToRemove));
  };

  const handlePredict = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    setError("");
    setWarning("");
    setResult(null);

    const prompt = `You are a medical AI that provides disease predictions based on symptoms.

    Given these symptoms: "${symptoms.join(", ")}", return a JSON object with **only** the following structure:
    
    {
      "condition": "Most likely condition (or a general response if symptoms are insufficient)",
      "confidence": 0.00, 
      "probability": "Probability description, including advice.",
      "note": "If symptoms are too few, say 'Insufficient symptoms for precise diagnosis'. If input is invalid (not symptoms), say 'Invalid input: Please enter real disease symptoms'."
    }
    
    **Strict rules:**
    - Return **only** valid JSON.
    - Use a confidence score between **0.00 and 1.00**.
    - Format probability with a descriptive range like **'Low to Moderate'** with a brief medical suggestion.
    - If symptoms are insufficient, make a general assessment of common scenarios (Nothing technical at all, keep it simple) but add "note": "Insufficient symptoms for precise diagnosis".
    - If the input is invalid, return "note": "Invalid input: Please enter real disease symptoms" and "condition": "N/A".
    - Do NOT include markdown formatting (\`\`\`json or \`\`\`).
    - Do NOT add any explanations, forward slashes, or additional text.
    
    Only output the JSON object.`;

    try {
      const response = await fetch("http://127.0.0.1:8001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const text = await response.text();
      console.log("Raw API Response:", text);

      try {
        const outerJson = JSON.parse(text);
        const data = JSON.parse(outerJson.response);
        console.log(data);

        // Add to session summaries
        const username = getCookie('username') || 'Guest';
        const role = getCookie('role') || 'Anonymous';
        
        setSessionSummaries(prev => [...prev, {
          date: getCurrentDate(),
          username,
          role,
          symptoms: [...symptoms],
          result: data
        }]);

        if (data.note === "Insufficient symptoms for precise diagnosis") {
          setWarning("⚠️ Not enough symptoms for a precise prediction. Here's a general assessment:");
          setResult(data);
        } else if (data.note === "Invalid input: Please enter real disease symptoms") {
          setError("❌ Invalid input. Please enter real disease symptoms.");
        } else {
          setResult(data);
        }
      } catch (jsonError) {
        setError("Invalid JSON format from server.");
      }
    } catch (error) {
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Disease Prediction</h2>

          {/* Symptom Input */}
          <div className="flex space-x-4 mb-6">
            <Input
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Enter a symptom"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddSymptom()}
            />
            <Button
              onClick={handleAddSymptom}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              Add
            </Button>
          </div>

          {/* Symptoms List */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s, index) => (
                <Badge
                  key={index}
                  className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-colors duration-200 flex items-center gap-2"
                  onClick={() => handleRemoveSymptom(s)}
                >
                  {s}
                  <svg
                    className="w-4 h-4"
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
                </Badge>
              ))}
            </div>
          </div>

          {/* Predict Button */}
          <Button
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200 mb-6"
            onClick={handlePredict}
            disabled={loading || symptoms.length === 0}
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
                Predicting...
              </div>
            ) : (
              "Predict Condition"
            )}
          </Button>

          {/* Error and Warning Messages */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
              {error}
            </Alert>
          )}
          {warning && (
            <Alert className="mb-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl p-4">
              {warning}
            </Alert>
          )}

          {/* Prediction Result */}
          {result && !showSummary && (
            <CardContent className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <div className="space-y-3">
                <p className="flex justify-between items-center">
                  <span className="text-white/70">Condition:</span>
                  <span className="text-accent-400 font-medium">{result.condition}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-white/70">Confidence:</span>
                  <span className="text-accent-400 font-medium">{result.confidence}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-white/70">Probability:</span>
                  <span className="text-accent-400 font-medium">{result.probability}</span>
                </p>
              </div>
            </CardContent>
          )}

          {/* Session Summary Section */}
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? "Hide Session Summary" : "View Session Summary"}
            </Button>

            {showSummary && sessionSummaries.length > 0 && (
              <div className="mt-6 space-y-4">
                {sessionSummaries.map((session, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white font-medium">{session.username}</p>
                        <p className="text-white/50 text-sm">{session.date}</p>
                      </div>
                      <Badge className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full">
                        {session.role}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        Symptoms: {session.symptoms.join(", ")}
                      </p>
                      <p className="text-white/70">
                        Prediction: {session.result.condition}
                      </p>
                      <p className="text-white/70">
                        Confidence: {session.result.confidence}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
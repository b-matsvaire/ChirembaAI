import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Navbar from "@/components/navbar";
import questions from './questions.json';

const MedicalHistory = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cookies] = useCookies(['username']);
  const router = useRouter();

  const symptomsOptions = [
    "Fever",
    "Headache",
    "Cough",
    "Acidity",
    "Joint Pain",
    "Diabetes",
    "Common Cold",
    "Stomach Pain",
    "Period Problems",
    "Mood Swings",
    "Runny Nose",
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => {
      const selectedOptions = prev[questionId]?.selected || [];
      const isSelected = selectedOptions.includes(option);
      const newSelectedOptions = isSelected
        ? selectedOptions.filter(opt => opt !== option)
        : [...selectedOptions, option];

      return {
        ...prev,
        [questionId]: {
          selected: newSelectedOptions,
          details: newSelectedOptions.length === 0 ? "" : (prev[questionId]?.details || "")
        }
      };
    });
  };

  const handleDetailChange = (questionId, details) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        details
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/activecomplaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: cookies.username, answers })
      });

      if (response.ok) {
        console.log('Active complaint added successfully');
        router.push('/medicaldata/history');
      } else {
        throw new Error('Failed to save active complaint');
      }
    } catch (error) {
      console.error('Error saving active complaint:', error);
      alert('Error saving active complaint');
    }
  };

  if (!isClient) {
    return null;
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">Medical History Summary</h2>
              <div className="space-y-6">
                {Object.entries(answers).map(([questionId, answer]) => (
                  <div key={questionId} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {questions.find(q => q.id === parseInt(questionId)).description}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70">
                        <span className="text-accent-400">Response:</span> {answer.selected.join(", ")}
                      </p>
                      {answer.details && (
                        <p className="text-white/70">
                          <span className="text-accent-400">Details:</span> {answer.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02]"
              >
                Submit Medical History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {questions[currentQuestion].title}
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-accent-400 font-medium">
                  {currentQuestion + 1}
                </div>
                <div className="text-white/50">/</div>
                <div className="text-white/70">
                  {questions.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <p className="text-xl text-white/90">
                {questions[currentQuestion].description}
              </p>
            </div>

            {/* Options */}
            <div className="mb-8">
              {currentQuestion === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {symptomsOptions.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleOptionSelect(questions[currentQuestion].id, symptom)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        answers[questions[currentQuestion].id]?.selected?.includes(symptom)
                          ? "bg-gradient-to-r from-primary-500 to-accent-500 border-transparent text-white"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(questions[currentQuestion].id, option)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        answers[questions[currentQuestion].id]?.selected?.includes(option)
                          ? "bg-gradient-to-r from-primary-500 to-accent-500 border-transparent text-white"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Input */}
            {answers[questions[currentQuestion].id]?.selected && currentQuestion !== 0 && (
              <div className="mb-8">
                <textarea
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder={questions[currentQuestion].detailPrompt}
                  value={answers[questions[currentQuestion].id]?.details || ""}
                  onChange={(e) => handleDetailChange(questions[currentQuestion].id, e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentQuestion === 0
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                {currentQuestion === questions.length - 1 ? "Review" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;

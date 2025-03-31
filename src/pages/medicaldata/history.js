import { useState } from "react";
import { useRouter } from "next/router";

export default function HealthHistory() {
  const [currentSection, setCurrentSection] = useState("personal"); // Default section
  const [personalHistory, setPersonalHistory] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [allergies, setAllergies] = useState(["Dust", "Pollen", "Peanuts", "Milk"]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [duration, setDuration] = useState("");
  const [showSummary, setShowSummary] = useState(false); // Toggle for summary view
  const router = useRouter();



  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Handle option click for popup
  const handleOptionClick = (option) => {
    setPopupMessage(`${option} has been added. View Summary.`);
    setShowPopup(true);

    // Hide popup automatically after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };


  const options = {
    personal: ["Alcohol", "Drugs", "Smoking"],
    family: [
      "Diabetes",
      "Osteoporosis",
      "High Cholesterol",
      "Hypertension",
      "Asthma",
      "Birth Defects",
      "Mental Illness",
      "Stroke",
      "Heart Disease",
      "Cancer",
      "Genetic Conditions",
    ],
    medical: ["Surgery", "Injuries", "Chronic Illnesses", "Hospitalization"],
  };

  const handleAddItem = () => {
    const selectedHistory =
      currentSection === "personal"
        ? personalHistory
        : currentSection === "family"
        ? familyHistory
        : medicalHistory;

    const setSelectedHistory =
      currentSection === "personal"
        ? setPersonalHistory
        : currentSection === "family"
        ? setFamilyHistory
        : setMedicalHistory;

    if (customInput.trim()) {
      setSelectedHistory([...selectedHistory, customInput.trim()]);
      setCustomInput("");
    }
  };

  const handleAddOption = (option) => {
    const selectedHistory =
      currentSection === "personal"
        ? personalHistory
        : currentSection === "family"
        ? familyHistory
        : medicalHistory;

    const setSelectedHistory =
      currentSection === "personal"
        ? setPersonalHistory
        : currentSection === "family"
        ? setFamilyHistory
        : setMedicalHistory;

    if (!selectedHistory.includes(option)) {
      setSelectedHistory([...selectedHistory, option]);
    }
  };

  const handleAddAllergy = () => {
    if (customInput.trim() && duration) {
      setSelectedAllergies([
        ...selectedAllergies,
        { allergy: customInput.trim(), duration },
      ]);
      setCustomInput("");
      setDuration("");
    }
  };

  const handleAddSelectedAllergy = (allergy) => {
    if (!selectedAllergies.some((item) => item.allergy === allergy) && duration) {
      setSelectedAllergies([...selectedAllergies, { allergy, duration }]);
      setDuration("");
    }
  };

  const handleNavigation = (direction) => {
    const sections = ["personal", "family", "medical"];
    const currentIndex = sections.indexOf(currentSection);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % sections.length
        : (currentIndex - 1 + sections.length) % sections.length;
    setCurrentSection(sections[newIndex]);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/healthhistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalHistory,
          familyHistory,
          medicalHistory,
          allergies: selectedAllergies,
        }),
      });

      if (response.ok) {
        console.log("Health history added successfully");
        router.push("/medicaldata/reports");
      } else {
        throw new Error("Failed to save health history");
      }
    } catch (error) {
      console.error("Error saving health history:", error);
      alert("Error saving health history");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-300 p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl text-center font-semibold text-teal-600 mb-4">
          Health History
        </h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["personal", "family", "medical"].map((section) => (
            <button
              key={section}
              onClick={() => {
                setCurrentSection(section);
                setShowSummary(false);
              
              }}
              className={`px-4 py-2 font-semibold rounded-lg ${
                currentSection === section
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-teal-700 hover:bg-gray-300"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)} History
            </button>
          ))}
        </div>
            {/* Popup Notification */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg border border-teal-300 rounded-lg p-4 flex items-center gap-4 animate-slide-in">
          <p className="text-teal-800">{popupMessage}</p>
          <button
            onClick={() => setShowPopup(false)}
            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      )}

        {/* Summary Button */}
        <button
          onClick={() => setShowSummary(true)}
          className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          View Summary
        </button>

        {/* Toggle between Summary and Form Sections */}
        {!showSummary ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                {currentSection.charAt(0).toUpperCase() +
                  currentSection.slice(1)}{" "}
                History
              </h2>
              <div className="flex flex-wrap gap-4">
                {options[currentSection].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {handleAddOption(option);
                      handleOptionClick(option);

                    }}
                    className="px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-full hover:bg-teal-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={`Add a different ${currentSection} history`}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-teal-500"
                />
                <button
                onClick={() => {
                  handleOptionClick(customInput);
                  handleAddItem();
                }}
                 
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => handleNavigation("prev")}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => handleNavigation("next")}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-teal-600 mb-4">Summary</h2>
            <div className="mb-4">
              <h3 className="font-semibold">Personal History:</h3>
              <ul className="list-disc pl-5">
                {personalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Family History:</h3>
              <ul className="list-disc pl-5">
                {familyHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Medical History:</h3>
              <ul className="list-disc pl-5">
                {medicalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Allergies:</h3>
              <ul className="list-disc pl-5">
                {selectedAllergies.map((item, index) => (
                  <li key={index}>
                    {item.allergy} - {item.duration}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

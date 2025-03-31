import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios"; // Add axios for making HTTP requests

export default function UploadReport() {
  const [reportType, setReportType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies(["username"]);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "image/png") {
      setErrorMessage("Only PNG files are allowed.");
      setSelectedFile(null);
    } else {
      setErrorMessage("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType || !selectedFile) {
      setErrorMessage("Please fill all fields.");
      return;
    }
    setErrorMessage("");

    const formData = new FormData();
    formData.append("reportType", reportType);
    formData.append("file", selectedFile);
    formData.append("username", cookies.username);

    try {
      await axios.post("/api/uploadReport", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/dashboard"); // Redirect to success page after upload
    } catch (error) {
      setErrorMessage("Failed to upload the report.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-teal-600">
          Upload Health Report
        </h2>
        <div className="mb-4">
          <label
            htmlFor="reportType"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select type --</option>
            <option value="Prescription">Prescription</option>
            <option value="Diagnostic Report">Diagnostic Report</option>
            <option value="OP Consultation">OP Consultation</option>
            <option value="Discharge Summary">Discharge Summary</option>
            <option value="Immunization Record">Immunization Record</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 font-medium mb-2"
          >
            Add Health Record (PNG only)
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            accept="image/png"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="w-full bg-teal-200 text-gray-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

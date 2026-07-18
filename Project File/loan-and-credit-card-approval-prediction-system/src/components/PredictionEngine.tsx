import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckSquare, AlertTriangle, Play, HelpCircle, FileText, ArrowRight, ShieldCheck, ShieldAlert, Percent, Settings2 } from "lucide-react";
import { ModelType, PredictionResponse } from "../types";

export default function PredictionEngine() {
  const [modelType, setModelType] = useState<ModelType>("Random Forest");
  
  // Inputs
  const [income, setIncome] = useState<number>(145000);
  const [incomeType, setIncomeType] = useState<string>("Commercial associate");
  const [educationType, setEducationType] = useState<string>("Higher education");
  const [familyStatus, setFamilyStatus] = useState<string>("Married");
  const [housingType, setHousingType] = useState<string>("House");
  const [employmentYears, setEmploymentYears] = useState<number>(6);
  const [ageYears, setAgeYears] = useState<number>(34);
  const [familyMembers, setFamilyMembers] = useState<number>(3);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [overdueStatus, setOverdueStatus] = useState<string>("Paid on time");

  const [loading, setLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setPredictionResult(null);

    const payload = {
      income,
      incomeType,
      educationType,
      familyStatus,
      housingType,
      employmentDays: employmentYears * 365,
      ageYears,
      familyMembers,
      childrenCount,
      overdueStatus,
      modelType,
      hyperparameters: {
        maxDepth: 10,
        nEstimators: 120,
        criterion: "gini",
      },
    };

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Prediction request failed. Ensure your Gemini API Key is configured.");
      }

      const data: PredictionResponse = await res.json();
      setPredictionResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong while executing predictions.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPredictionResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      
      {/* Title Header bar */}
      <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Live Prediction Engine (Flask Equivalent)</h3>
            <p className="text-[11px] text-slate-400">
              Submit applicant details to run inference on our backend models & Gemini.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 text-indigo-300 border border-slate-800 px-2.5 py-1 rounded">
          Active Model: {modelType}
        </span>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!predictionResult && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              
              {/* Algorithm Configuration bar */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">
                    Select ML Algorithm for Inference
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Different algorithms leverage customized classification boundaries.
                  </p>
                </div>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as ModelType)}
                  className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-2.5 px-3 rounded-lg shadow-2xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Logistic Regression">Logistic Regression Classifier</option>
                  <option value="Decision Tree">Decision Tree Classifier</option>
                  <option value="Random Forest">Random Forest Classifier (Ensemble)</option>
                </select>
              </div>

              {/* Attributes Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Income */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Annual Income ($)</label>
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                      ${income.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="500000"
                    step="5000"
                    value={income}
                    onChange={(e) => setIncome(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Years Employed */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Employment Tenure</label>
                    <span className="font-mono font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                      {employmentYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={employmentYears}
                    onChange={(e) => setEmploymentYears(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Applicant Age</label>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      {ageYears} Years Old
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="75"
                    step="1"
                    value={ageYears}
                    onChange={(e) => setAgeYears(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Income Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Income Category</label>
                  <select
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Commercial associate">Commercial Associate</option>
                    <option value="Working">Working Class</option>
                    <option value="Pensioner">Pensioner / Retired</option>
                    <option value="State servant">State Servant / Public Sector</option>
                    <option value="Student">Student / Academic</option>
                  </select>
                </div>

                {/* Education */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Education Level</label>
                  <select
                    value={educationType}
                    onChange={(e) => setEducationType(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Higher education">Higher Education</option>
                    <option value="Secondary / secondary special">Secondary / Secondary Special</option>
                    <option value="Incomplete higher">Incomplete Higher</option>
                    <option value="Lower secondary">Lower Secondary</option>
                    <option value="Academic degree">Academic Degree</option>
                  </select>
                </div>

                {/* Housing Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Housing Scenario</label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="House">House / Apartment Ownership</option>
                    <option value="Rented apartment">Rented Apartment</option>
                    <option value="Municipal apartment">Municipal Apartment</option>
                    <option value="With parents">Living With Parents</option>
                    <option value="Co-op apartment">Co-op Apartment</option>
                    <option value="Office apartment">Office Apartment</option>
                  </select>
                </div>

                {/* Family Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Marital Family Status</label>
                  <select
                    value={familyStatus}
                    onChange={(e) => setFamilyStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Married">Married</option>
                    <option value="Single">Single / Not Married</option>
                    <option value="Civil marriage">Civil Marriage Accord</option>
                    <option value="Separated">Separated</option>
                    <option value="Widow">Widow</option>
                  </select>
                </div>

                {/* Family members & children counts */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Family Members Count</label>
                  <select
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(parseInt(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Children Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Children Count</label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(parseInt(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-xs py-2 px-2.5 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Historical Overdue / Credit payment status */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <CheckSquare className="w-4 h-4 text-indigo-500" />
                    Credit Repayment Payment Overdue History (Target Matrix Variable)
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Sourced from the Credit Card Repayment dataset history ledger. Critical factor in scoring.
                  </p>
                </div>
                <select
                  value={overdueStatus}
                  onChange={(e) => setOverdueStatus(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-2.5 px-3 rounded-lg shadow-2xs focus:outline-hidden focus:border-indigo-500 cursor-pointer w-full md:w-auto"
                >
                  <option value="No loan">No loan records (Clean)</option>
                  <option value="Paid on time">Paid on time (Low default probability)</option>
                  <option value="1-29 days overdue">1-29 days overdue (Minor risk)</option>
                  <option value="30-59 days overdue">30-59 days overdue (Moderate risk)</option>
                  <option value="60+ days overdue/bad debt">60+ days overdue (Bad debt / Write-off)</option>
                </select>
              </div>

              {/* Submit Error */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/15 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Evaluating Credit Decision...
                    </>
                  ) : (
                    <>
                      Run Scoring Inference <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* Inference Results Board */}
          {predictionResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              {/* Approval status banner */}
              <div
                className={`rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${
                  predictionResult.approved
                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                    : "bg-rose-50/50 border-rose-100 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div
                    className={`p-4 rounded-full ${
                      predictionResult.approved ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    }`}
                  >
                    {predictionResult.approved ? (
                      <ShieldCheck className="w-10 h-10" />
                    ) : (
                      <ShieldAlert className="w-10 h-10" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-2xl">
                      {predictionResult.approved ? "APPLICATION APPROVED" : "APPLICATION REJECTED"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prediction compiled via {modelType} Classifier with{" "}
                      <strong className="text-slate-800">
                        {(predictionResult.confidence * 100).toFixed(0)}%
                      </strong>{" "}
                      model confidence.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white/80 border border-slate-100 px-4 py-2.5 rounded-xl text-center shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Approved Prob</span>
                    <span className="text-lg font-bold font-mono text-emerald-600">
                      {(predictionResult.probabilityApproved * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-white/80 border border-slate-100 px-4 py-2.5 rounded-xl text-center shadow-2xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Rejected Prob</span>
                    <span className="text-lg font-bold font-mono text-rose-600">
                      {(predictionResult.probabilityRejected * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation generated by Gemini */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FileText className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Percent className="w-4 h-4" />
                    Explanatory Inference Report (Gemini AI Powered)
                  </h5>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                    &quot;{predictionResult.explanation}&quot;
                  </p>
                </div>
              </div>

              {/* Model Validation stats */}
              <div className="border border-slate-100 rounded-2xl p-6">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Current Classifier Testing Validation Metrics
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Precision", val: predictionResult.metrics.precision, color: "text-indigo-600" },
                    { label: "Recall", val: predictionResult.metrics.recall, color: "text-teal-600" },
                    { label: "F1 Score", val: predictionResult.metrics.f1Score, color: "text-emerald-600" },
                    { label: "Accuracy", val: predictionResult.metrics.accuracy, color: "text-purple-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl text-center shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">{stat.label}</span>
                      <span className={`text-xl font-bold font-mono ${stat.color}`}>
                        {(stat.val * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back actions */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={resetForm}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  Submit Another Applicant profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

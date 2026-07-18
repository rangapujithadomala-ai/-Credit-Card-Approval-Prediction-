import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, Play, RefreshCw, AlertTriangle, FileSpreadsheet, Eye } from "lucide-react";
import { SampleRecord } from "../types";

export default function DataPreprocessing() {
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Raw, messy sample rows before processing
  const [records, setRecords] = useState<SampleRecord[]>([
    { id: 1001, income: 157500, incomeType: "Commercial associate", educationType: "Higher education", familyStatus: "Married", housingType: "House", employmentDays: -2510, ageYears: -42, familyMembers: 2, childrenCount: 0, overdueStatus: "Paid on time" },
    { id: 1001, income: 157500, incomeType: "Commercial associate", educationType: "Higher education", familyStatus: "Married", housingType: "House", employmentDays: -2510, ageYears: -42, familyMembers: 2, childrenCount: 0, overdueStatus: "Paid on time", duplicate: true },
    { id: 1002, income: 112500, incomeType: "Working", educationType: "Secondary", familyStatus: "Single", housingType: "Rented apartment", employmentDays: -410, ageYears: -28, familyMembers: 1, childrenCount: 0, overdueStatus: "60+ days overdue/bad debt" },
    { id: 1003, income: 225000, incomeType: "Pensioner", educationType: "Academic degree", familyStatus: "Separated", housingType: "House", employmentDays: 0, ageYears: -61, familyMembers: 1, childrenCount: 0, overdueStatus: "No loan" },
    { id: 1004, income: 135000, incomeType: "State servant", educationType: "Higher education", familyStatus: "Civil marriage", housingType: "House", employmentDays: -5400, ageYears: -35, familyMembers: 4, childrenCount: 2, overdueStatus: "1-29 days overdue", hasNulls: true },
  ]);

  const steps = [
    {
      title: "Raw Dirty Dataset",
      desc: "Our dataset starts with duplicates, negative calendar days (representing offsets), missing values, and high-cardinality multi-class repayment codes.",
      code: "# Load demographic and credit status dataframes\napp = pd.read_csv('applicant_details.csv')\ncredit = pd.read_csv('credit_history.csv')",
    },
    {
      title: "Step 1: Deduplication",
      desc: "Ensure unique applicants. Remove identical rows using Applicant ID as the subset selector.",
      code: "df = df.drop_duplicates(subset='Applicant_ID', keep='first')",
    },
    {
      title: "Step 2: Null Imputation",
      desc: "Detect and clean missing records. Null values in Occupation or Housing are flagged or dropped to clean up predictive matrices.",
      code: "df = df.dropna(subset=['OCCUPATION_TYPE'])  # Or impute missing values",
    },
    {
      title: "Step 3: Day Absolute Transformation",
      desc: "Demographic DAYS_EMPLOYED and DAYS_BIRTH are native relative negative values. Apply abs() to transform them into positive integers and map to years.",
      code: "df['DAYS_BIRTH'] = df['DAYS_BIRTH'].abs() / 365\ndf['DAYS_EMPLOYED'] = df['DAYS_EMPLOYED'].abs()",
    },
    {
      title: "Step 4: Status Binarization",
      desc: "Repayment history states (C, 0, 1, 2, 5) are remapped into a binary target: 0 (Good / Approved) vs 1 (Default / Not Approved).",
      code: "df['STATUS'] = df['STATUS'].map(lambda x: 1 if x in ['2','3','4','5'] else 0)",
    },
    {
      title: "Step 5: Label Encoding",
      desc: "Convert categorical strings into clean integers suitable for Scikit-learn algorithms.",
      code: "from sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\nfor col in categorical_cols:\n    df[col] = le.fit_transform(df[col])",
    },
    {
      title: "Step 6: Table Merging",
      desc: "Merge cleaned demographic columns and credit metrics together on 'Applicant_ID' to generate the final model training dataframe.",
      code: "final_df = pd.merge(app, credit, on='Applicant_ID', how='inner')",
    },
  ];

  const handleNextStep = () => {
    if (pipelineStep < steps.length - 1) {
      setPipelineStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (pipelineStep > 0) {
      setPipelineStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setPipelineStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Sidebar Stepper control */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <RefreshCw className={`w-5 h-5 ${isPlaying ? "animate-spin" : ""}`} />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">Preprocessing Pipeline</span>
          </div>

          <h3 className="font-bold text-lg text-white mb-2">{steps[pipelineStep].title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">{steps[pipelineStep].desc}</p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6 relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500">Python (Pandas)</div>
            <pre className="text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {steps[pipelineStep].code}
            </pre>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
            <span>Progress:</span>
            <span className="font-mono text-white">Step {pipelineStep} of {steps.length - 1}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handlePrevStep}
              disabled={pipelineStep === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs py-2 px-3 rounded-lg font-medium transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleNextStep}
              disabled={pipelineStep === steps.length - 1}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Visualizer */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-lg">Interactive Data Cleaning Board</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              <Eye className="w-3.5 h-3.5" />
              Live Stage Simulation
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Watch how the raw demographic table rows clean and encode themselves as you advance through the stepper.
          </p>

          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">ID</th>
                    <th className="px-3 py-2.5 text-right">Income</th>
                    <th className="px-3 py-2.5">Income Type</th>
                    <th className="px-3 py-2.5">Education</th>
                    <th className="px-3 py-2.5">Housing</th>
                    <th className="px-3 py-2.5 text-right">Days Employed</th>
                    <th className="px-3 py-2.5 text-right">Age (Y)</th>
                    <th className="px-3 py-2.5">Credit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {records
                      // Step 1: Filter duplicate
                      .filter((row) => !(pipelineStep >= 1 && row.duplicate))
                      // Step 2: Impute missing (hasNulls true row is dropped)
                      .filter((row) => !(pipelineStep >= 2 && row.hasNulls))
                      .map((row) => {
                        // Step 3: Absolute days
                        const showAbsDays = pipelineStep >= 3;
                        // Step 4: Binarize
                        const showBinarized = pipelineStep >= 4;
                        // Step 5: Encode categories
                        const showEncoded = pipelineStep >= 5;

                        return (
                          <motion.tr
                            key={row.id + (row.duplicate ? "-dup" : "")}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`${row.duplicate ? "bg-red-50/40 text-red-700" : "hover:bg-slate-50/50"}`}
                          >
                            <td className="px-3 py-3 font-semibold text-slate-700">
                              {row.id}
                              {row.duplicate && pipelineStep === 0 && (
                                <span className="ml-1 text-[9px] bg-red-100 text-red-800 px-1 rounded font-sans font-bold uppercase">
                                  Dup
                                </span>
                              )}
                              {row.hasNulls && pipelineStep === 0 && (
                                <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-sans font-bold uppercase">
                                  Nulls
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-3 text-right font-medium text-slate-800">
                              ${row.income.toLocaleString()}
                            </td>

                            <td className="px-3 py-3">
                              {showEncoded ? (
                                <span className="bg-teal-50 border border-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {row.incomeType === "Commercial associate" ? "0" : row.incomeType === "Working" ? "1" : "2"}
                                </span>
                              ) : (
                                row.incomeType
                              )}
                            </td>

                            <td className="px-3 py-3">
                              {showEncoded ? (
                                <span className="bg-teal-50 border border-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {row.educationType === "Higher education" ? "0" : row.educationType === "Secondary" ? "1" : "2"}
                                </span>
                              ) : (
                                row.educationType
                              )}
                            </td>

                            <td className="px-3 py-3">
                              {showEncoded ? (
                                <span className="bg-teal-50 border border-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {row.housingType === "House" ? "0" : "1"}
                                </span>
                              ) : (
                                row.housingType
                              )}
                            </td>

                            <td className="px-3 py-3 text-right">
                              {showAbsDays ? (
                                <span className="text-emerald-600 font-semibold">
                                  {Math.abs(row.employmentDays)} days
                                </span>
                              ) : (
                                <span className="text-red-500 font-semibold">{row.employmentDays}</span>
                              )}
                            </td>

                            <td className="px-3 py-3 text-right">
                              {showAbsDays ? (
                                <span className="text-emerald-600 font-semibold">
                                  {Math.abs(row.ageYears)} yrs
                                </span>
                              ) : (
                                <span className="text-red-500 font-semibold">{row.ageYears}</span>
                              )}
                            </td>

                            <td className="px-3 py-3">
                              {showBinarized ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
                                    row.overdueStatus === "60+ days overdue/bad debt"
                                      ? "bg-red-50 text-red-700 border border-red-100"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  }`}
                                >
                                  {row.overdueStatus === "60+ days overdue/bad debt" ? "Reject (1)" : "Approve (0)"}
                                </span>
                              ) : (
                                <span className="text-slate-600 font-sans text-xs">{row.overdueStatus}</span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dynamic warning indicator */}
        <div className="mt-6">
          {pipelineStep === 0 && (
            <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
              <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong>Critical Errors Found in Raw Data:</strong> Duplicate user rows detect multiple applications for applicant ID 1001. Negative indices represent offset days. Missing data found in state servant ID 1004. Remediate using the pipeline buttons on the left.
              </div>
            </div>
          )}

          {pipelineStep > 0 && pipelineStep < steps.length - 1 && (
            <div className="bg-teal-50 border border-teal-100 text-teal-800 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
              <Check className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Active Transformation:</strong> Running {steps[pipelineStep].title}. Cells are actively updated on the matrix table to reflect data preparation for algorithm input arrays.
              </div>
            </div>
          )}

          {pipelineStep === steps.length - 1 && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
              <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Preprocessing Complete!</strong> Demographic variables and credit payment target classes are fully cleaned, numerical labels are mapped, and tables are merged. Ready for training ML algorithms.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

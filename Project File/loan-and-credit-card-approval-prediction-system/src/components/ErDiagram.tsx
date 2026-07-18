import { useState } from "react";
import { motion } from "motion/react";
import { User, FileText, CreditCard, Brain, CheckSquare, ArrowRight, Activity, Database, Key } from "lucide-react";

interface Entity {
  id: string;
  name: string;
  icon: any;
  color: string;
  primaryKey: string;
  attributes: { name: string; type: string; isKey?: "PK" | "FK" | null }[];
  description: string;
  relationships: { target: string; type: string; desc: string }[];
}

export default function ErDiagram() {
  const [selectedEntity, setSelectedEntity] = useState<string>("Applicant_Details");

  const entities: Record<string, Entity> = {
    Users: {
      id: "Users",
      name: "Users",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      primaryKey: "UserID",
      attributes: [
        { name: "UserID", type: "Integer", isKey: "PK" },
        { name: "Name", type: "String" },
        { name: "Email", type: "String" },
        { name: "Password", type: "String (Hashed)" },
        { name: "Role", type: "String (Admin/BankStaff/Applicant)" },
      ],
      description: "Represents users of the system (loan officers, credit analysts, or bank staff) who manage, query, and review credit card and loan approval records.",
      relationships: [
        { target: "Applicant_Details", type: "1 to Many", desc: "A single system user can manage or submit multiple applicant detail records for evaluation." },
      ],
    },
    Applicant_Details: {
      id: "Applicant_Details",
      name: "Applicant Details",
      icon: FileText,
      color: "from-emerald-500 to-teal-600",
      primaryKey: "ApplicantID",
      attributes: [
        { name: "ApplicantID", type: "Integer", isKey: "PK" },
        { name: "UserID", type: "Integer", isKey: "FK" },
        { name: "IncomeType", type: "String (Commercial, State, etc.)" },
        { name: "EducationType", type: "String (Higher education, etc.)" },
        { name: "FamilyStatus", type: "String (Married, Single, etc.)" },
        { name: "HousingType", type: "String (House, Rented, etc.)" },
        { name: "EmploymentDays", type: "Integer (Days employed, negative)" },
      ],
      description: "Stores demographic, professional, and baseline financial attributes of the credit card or loan applicant.",
      relationships: [
        { target: "Users", type: "Many to 1", desc: "Applicant detail entries are managed/submitted by a system User." },
        { target: "Credit_History", type: "1 to Many", desc: "An applicant has a historical monthly ledger of credit repayments." },
        { target: "Approval_Prediction", type: "1 to 1", desc: "Each applicant detail record is evaluated to yield a single final approval prediction." },
      ],
    },
    Credit_History: {
      id: "Credit_History",
      name: "Credit History",
      icon: CreditCard,
      color: "from-amber-500 to-orange-600",
      primaryKey: "HistoryID",
      attributes: [
        { name: "HistoryID", type: "Integer", isKey: "PK" },
        { name: "ApplicantID", type: "Integer", isKey: "FK" },
        { name: "Month", type: "Integer (Relative offset)" },
        { name: "Status", type: "String (C, 0, 1, 2, 3, 4, 5)" },
        { name: "OverdueDays", type: "Integer" },
      ],
      description: "Logs the monthly status codes of repayments. In pre-processing, these multi-class statuses are mapped and binarized into high vs low risk.",
      relationships: [
        { target: "Applicant_Details", type: "Many to 1", desc: "Multiple monthly repayment logs belong to a single applicant details record." },
        { target: "Approval_Prediction", type: "Used in", desc: "Aggregated monthly status values determine the target label and predict final approval." },
      ],
    },
    ML_Model: {
      id: "ML_Model",
      name: "ML Model",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      primaryKey: "ModelID",
      attributes: [
        { name: "ModelID", type: "Integer", isKey: "PK" },
        { name: "ModelName", type: "String (RandomForest, LogisticReg)" },
        { name: "Algorithm", type: "String" },
        { name: "Hyperparameters", type: "JSON" },
        { name: "Accuracy", type: "Float" },
      ],
      description: "Details the machine learning models trained (e.g., Logistic Regression, Decision Tree, Random Forest) with specific configurations and validation scores.",
      relationships: [
        { target: "Approval_Prediction", type: "1 to Many", desc: "A single machine learning model can generate multiple final approval prediction results." },
      ],
    },
    Approval_Prediction: {
      id: "Approval_Prediction",
      name: "Approval Prediction",
      icon: CheckSquare,
      color: "from-cyan-500 to-blue-600",
      primaryKey: "PredictionID",
      attributes: [
        { name: "PredictionID", type: "Integer", isKey: "PK" },
        { name: "ApplicantID", type: "Integer", isKey: "FK" },
        { name: "ModelID", type: "Integer", isKey: "FK" },
        { name: "Result", type: "Boolean (Approved/Rejected)" },
        { name: "Confidence", type: "Float (0.0 to 1.0)" },
        { name: "PredictionDate", type: "DateTime" },
        { name: "Explanation", type: "String" },
      ],
      description: "Holds the final prediction output, decision probability parameters, and natural language explanations generated from running inference on the applicant details.",
      relationships: [
        { target: "Applicant_Details", type: "1 to 1", desc: "One unique approval prediction is evaluated per applicant profile." },
        { target: "ML_Model", type: "Many to 1", desc: "Prediction result is generated using a specific trained Machine Learning Model." },
      ],
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Visual ER Diagram Board */}
      <div className="lg:col-span-2 flex flex-col justify-between bg-white rounded-2xl border border-slate-100 p-6 shadow-xs relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-lg">Interactive ER Database Schema</h3>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
              5 Primary Entities
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-8">
            Click on any entity to inspect its structural columns, keys, and relational cardinality in the loan system database.
          </p>

          {/* Interactive Graph Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative min-h-[300px] items-center">
            {Object.values(entities).map((entity) => {
              const IconComp = entity.icon;
              const isSelected = selectedEntity === entity.id;

              return (
                <motion.div
                  key={entity.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedEntity(entity.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20 shadow-md"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-tr ${entity.color} text-white`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{entity.name}</span>
                  </div>

                  {/* Quick view list */}
                  <div className="space-y-1 text-xs font-mono text-slate-500">
                    <div className="flex justify-between items-center bg-white/80 px-2 py-0.5 rounded border border-slate-100">
                      <span className="text-indigo-600 font-bold">{entity.primaryKey}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1 rounded font-sans">PK</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-2">
                      + {entity.attributes.length - 1} more attributes
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
            <span>PK: Primary Key</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span>FK: Foreign Key</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>1 to Many Relationships</span>
          </div>
        </div>
      </div>

      {/* Detail Inspector Pane */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${entities[selectedEntity].color} text-white`}>
              {(() => {
                const SelectedIcon = entities[selectedEntity].icon;
                return <SelectedIcon className="w-6 h-6" />;
              })()}
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-lg">{entities[selectedEntity].name}</h4>
              <p className="text-xs text-slate-400 font-mono">Entity: {entities[selectedEntity].id}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {entities[selectedEntity].description}
          </p>

          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            Database Columns & Data Types
          </h5>

          {/* Table / Column Inspector */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden mb-6">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="px-3 py-2">Column</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-right">Constraint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {entities[selectedEntity].attributes.map((attr, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-3 py-2 text-indigo-300 font-semibold">{attr.name}</td>
                    <td className="px-3 py-2 text-slate-400">{attr.type}</td>
                    <td className="px-3 py-2 text-right">
                      {attr.isKey === "PK" && (
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold">
                          PK
                        </span>
                      )}
                      {attr.isKey === "FK" && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold">
                          FK
                        </span>
                      )}
                      {!attr.isKey && <span className="text-slate-600">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Relationships list */}
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Cardinarity & Relationships
          </h5>
          <div className="space-y-3">
            {entities[selectedEntity].relationships.map((rel, idx) => (
              <div key={idx} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between text-indigo-300">
                  <span className="font-semibold flex items-center gap-1">
                    {entities[selectedEntity].id} <ArrowRight className="w-3 h-3 text-slate-500" /> {rel.target}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-sans text-[10px] font-medium">
                    {rel.type}
                  </span>
                </div>
                <p className="text-slate-400 font-sans leading-relaxed">{rel.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Relational Integrity Enabled</span>
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

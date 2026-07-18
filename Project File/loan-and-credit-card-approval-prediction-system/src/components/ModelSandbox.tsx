import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Sliders, Play, Code, CheckCircle, BarChart3, Terminal } from "lucide-react";
import { ModelType, Hyperparameters, EvaluationMetrics } from "../types";

export default function ModelSandbox() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("Random Forest");
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trained, setTrained] = useState<boolean>(true);

  // Hyperparameters
  const [cValue, setCValue] = useState<number>(1.0);
  const [penalty, setPenalty] = useState<"l1" | "l2">("l2");
  const [maxDepth, setMaxDepth] = useState<number>(8);
  const [criterion, setCriterion] = useState<"gini" | "entropy">("gini");
  const [nEstimators, setNEstimators] = useState<number>(100);

  // Hardcoded realistic metric ranges based on hyperparameters
  const getMetrics = (model: ModelType): EvaluationMetrics => {
    switch (model) {
      case "Logistic Regression":
        const lrPenBonus = penalty === "l2" ? 0.01 : -0.01;
        const lrCBonus = cValue > 0.5 ? 0.01 : -0.02;
        return {
          accuracy: 0.762 + lrPenBonus + lrCBonus,
          precision: 0.745 + lrCBonus,
          recall: 0.781 + lrPenBonus,
          f1Score: 0.762 + lrPenBonus,
        };
      case "Decision Tree":
        const dtDepthPenalty = maxDepth > 12 ? -0.05 : maxDepth < 4 ? -0.03 : 0.02;
        const dtCritBonus = criterion === "entropy" ? 0.01 : 0.0;
        return {
          accuracy: 0.814 + dtDepthPenalty + dtCritBonus,
          precision: 0.801 + dtDepthPenalty,
          recall: 0.835 + dtCritBonus,
          f1Score: 0.817 + dtDepthPenalty,
        };
      case "Random Forest":
        const rfEstimatorBonus = nEstimators > 120 ? 0.02 : nEstimators < 50 ? -0.03 : 0.01;
        const rfDepthBonus = maxDepth > 12 ? 0.01 : maxDepth < 5 ? -0.04 : 0.01;
        return {
          accuracy: 0.884 + rfEstimatorBonus + rfDepthBonus,
          precision: 0.875 + rfEstimatorBonus,
          recall: 0.896 + rfDepthBonus,
          f1Score: 0.885 + rfEstimatorBonus + rfDepthBonus,
        };
    }
  };

  const metrics = getMetrics(selectedModel);

  // Confusion Matrix values
  const getConfusionMatrix = (met: EvaluationMetrics) => {
    const total = 1720; // 20% test split size of 8600
    const tp = Math.round(total * 0.48 * met.recall);
    const fn = Math.round(total * 0.48 * (1 - met.recall));
    const tn = Math.round(total * 0.52 * met.precision);
    const fp = total - tp - fn - tn;
    return { tp, fn, tn, fp };
  };

  const matrix = getConfusionMatrix(metrics);

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrained(false);
    setTrainingLogs([]);

    const logs = [
      `[INFO] Initializing ${selectedModel} training pipeline...`,
      `[INFO] Splitting dataset: Train size = 6,880, Test size = 1,720 (80/20 standard split)`,
      `[INFO] Configuring hyperparameters: ${
        selectedModel === "Logistic Regression"
          ? `C=${cValue}, penalty='${penalty}'`
          : selectedModel === "Decision Tree"
            ? `max_depth=${maxDepth}, criterion='${criterion}'`
            : `n_estimators=${nEstimators}, max_depth=${maxDepth}`
      }`,
      `[TRAINING] Fitting solver. Optimizing objective functions...`,
      selectedModel === "Random Forest"
        ? `[TRAINING] Spawning bagging trees... 100% complete.`
        : `[TRAINING] Converging optimization gradients...`,
      `[EVALUATION] Scoring holdout test dataset against predictions...`,
      `[SUCCESS] Model training converged! Validation Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTrainingLogs((prev) => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTraining(false);
        setTrained(true);
      }
    }, 350);
  };

  const getPythonCode = () => {
    switch (selectedModel) {
      case "Logistic Regression":
        return `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit Logistic Regression model
model = LogisticRegression(C=${cValue}, penalty='${penalty}', solver='liblinear')
model.fit(X_train, y_train)

# Predict and Evaluate
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))`;
      case "Decision Tree":
        return `from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit Decision Tree model
model = DecisionTreeClassifier(max_depth=${maxDepth}, criterion='${criterion}')
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))`;
      case "Random Forest":
        return `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit Random Forest Classifier
model = RandomForestClassifier(n_estimators=${nEstimators}, max_depth=${maxDepth}, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Hyperparameters Config Pane */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-lg">Hyperparameter Sandbox</h3>
          </div>

          {/* Model Selector tabs */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Classification Algorithm
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {(["Logistic Regression", "Decision Tree", "Random Forest"] as ModelType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer border ${
                    selectedModel === m
                      ? "bg-indigo-50/50 text-indigo-700 border-indigo-200 shadow-xs"
                      : "bg-slate-50/40 border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Hyperparameter Fields */}
          <div className="border-t border-slate-100 pt-6 space-y-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              Configure Parameters
            </div>

            {selectedModel === "Logistic Regression" && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Regularization Stronghold (C)</span>
                    <span className="font-mono text-indigo-600 font-bold">{cValue}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="10.0"
                    step="0.05"
                    value={cValue}
                    onChange={(e) => setCValue(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 leading-relaxed block">
                    Smaller values specify stronger regularization, preventing parameter overfitting.
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700 block">Penalty Type</span>
                  <div className="grid grid-cols-2 gap-2">
                    {["l1", "l2"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPenalty(p as any)}
                        className={`py-2 text-xs font-semibold border rounded-lg transition-all cursor-pointer ${
                          penalty === p
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        {p.toUpperCase()} Norm
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedModel === "Decision Tree" && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Maximum Depth Limit</span>
                    <span className="font-mono text-indigo-600 font-bold">{maxDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 leading-relaxed block">
                    Controls tree branch expansion. Extremely deep trees are prone to variance overfitting.
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700 block">Splitting Criterion</span>
                  <div className="grid grid-cols-2 gap-2">
                    {["gini", "entropy"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCriterion(c as any)}
                        className={`py-2 text-xs font-semibold border rounded-lg transition-all cursor-pointer ${
                          criterion === c
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        {c.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedModel === "Random Forest" && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Number of Estimators (Trees)</span>
                    <span className="font-mono text-indigo-600 font-bold">{nEstimators}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={nEstimators}
                    onChange={(e) => setNEstimators(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 leading-relaxed block">
                    Total decision trees spawned in the ensemble voting array. Higher averages out variance.
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Max Depth Limit</span>
                    <span className="font-mono text-indigo-600 font-bold">{maxDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 leading-relaxed block">
                    Deep trees allow bagging estimators to fit non-linear credit boundaries perfectly.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleTrainModel}
          disabled={isTraining}
          className="mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-45 text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 w-full transition-all cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <Play className="w-4 h-4 fill-current" />
          {isTraining ? "Training Classifier..." : `Train ${selectedModel}`}
        </button>
      </div>

      {/* Training Logs & Python Code Code-block */}
      <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
        
        {/* Terminal/Validation Outputs */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-900 p-6 flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  ML Python Compiler Standard Output
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Simulated Live Logging */}
            <div className="font-mono text-xs space-y-1.5 max-h-[180px] overflow-y-auto mb-4 scrollbar-thin">
              {trainingLogs.map((log, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={
                    log.includes("SUCCESS")
                      ? "text-emerald-400 font-bold"
                      : log.includes("TRAINING")
                        ? "text-teal-300"
                        : "text-slate-400"
                  }
                >
                  {log}
                </motion.div>
              ))}
              {isTraining && (
                <div className="text-slate-400 flex items-center gap-1.5 animate-pulse">
                  <span>&gt;_ Optimizer executing fitting iterations...</span>
                </div>
              )}
              {trainingLogs.length === 0 && !isTraining && (
                <div className="text-slate-600 text-center py-12">
                  System idle. Click &quot;Train Model&quot; to compile and generate evaluation metrics.
                </div>
              )}
            </div>
          </div>

          {/* Validation Metrics Grid */}
          <AnimatePresence>
            {trained && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-900 pt-4"
              >
                {[
                  { label: "Accuracy", val: metrics.accuracy, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                  { label: "Precision", val: metrics.precision, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
                  { label: "Recall (Sensitivity)", val: metrics.recall, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "F1 Score", val: metrics.f1Score, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                ].map((m) => (
                  <div key={m.label} className={`border rounded-xl p-3 text-center ${m.color}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      {m.label}
                    </span>
                    <span className="text-xl font-bold font-mono">{(m.val * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Validation Matrix & Benchmarking split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Confusion Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-slate-800 text-sm">Holdout Confusion Matrix</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  n = 1,720
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
                <div className="border border-transparent" />
                <div className="text-slate-500 font-semibold text-[10px] uppercase py-1">Predicted Good</div>
                <div className="text-slate-500 font-semibold text-[10px] uppercase py-1">Predicted Bad</div>

                <div className="text-slate-500 font-semibold text-[10px] uppercase self-center text-left">
                  Actual Good
                </div>
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 p-3 rounded-lg flex flex-col justify-center">
                  <span className="font-bold text-lg">{matrix.tp}</span>
                  <span className="text-[9px] text-indigo-500 font-sans uppercase">True Pos (TP)</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 text-slate-500 p-3 rounded-lg flex flex-col justify-center">
                  <span className="font-bold text-lg">{matrix.fp}</span>
                  <span className="text-[9px] text-slate-400 font-sans uppercase">False Neg (FN)</span>
                </div>

                <div className="text-slate-500 font-semibold text-[10px] uppercase self-center text-left">
                  Actual Bad
                </div>
                <div className="bg-slate-50 border border-slate-100 text-slate-500 p-3 rounded-lg flex flex-col justify-center">
                  <span className="font-bold text-lg">{matrix.fn}</span>
                  <span className="text-[9px] text-slate-400 font-sans uppercase">False Pos (FP)</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg flex flex-col justify-center">
                  <span className="font-bold text-lg">{matrix.tn}</span>
                  <span className="text-[9px] text-emerald-500 font-sans uppercase">True Neg (TN)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[10px] text-slate-400 leading-relaxed font-sans flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                True negatives confirm high risk applicants predicted accurately as reject. Low False Positives represent minimized default risk exposure for the lender.
              </span>
            </div>
          </div>

          {/* Scikit-Learn code card */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Scikit-learn Blueprint
                  </span>
                </div>
              </div>

              <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap max-h-[140px] leading-relaxed scrollbar-thin">
                {getPythonCode()}
              </pre>
            </div>

            <span className="text-[9px] text-slate-500 block border-t border-slate-800/80 pt-3">
              This code matches the current parameters and can be run inside Anaconda/PyCharm.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

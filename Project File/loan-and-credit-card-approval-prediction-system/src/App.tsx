import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database,
  BarChart3,
  RefreshCw,
  Brain,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import ErDiagram from "./components/ErDiagram";
import DataVisualization from "./components/DataVisualization";
import DataPreprocessing from "./components/DataPreprocessing";
import ModelSandbox from "./components/ModelSandbox";
import PredictionEngine from "./components/PredictionEngine";

type TabID = "er" | "viz" | "preprocess" | "sandbox" | "predict";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>("er");

  const tools = [
    { name: "Anaconda", url: "https://www.anaconda.com/download", desc: "Environment management" },
    { name: "PyCharm", url: "https://www.jetbrains.com/pycharm/", desc: "Python IDE" },
    { name: "NumPy", url: "https://numpy.org/doc/stable/", desc: "Numerical computing" },
    { name: "Pandas", url: "https://pandas.pydata.org/docs/", desc: "Data structures" },
    { name: "Scikit-learn", url: "https://scikit-learn.org/stable/", desc: "Machine Learning models" },
    { name: "Matplotlib", url: "https://matplotlib.org/stable/", desc: "Static plots" },
    { name: "Seaborn", url: "https://seaborn.pydata.org/", desc: "Statistical graphics" },
    { name: "Flask", url: "https://flask.palletsprojects.com/", desc: "Micro web framework" },
  ];

  const tabList = [
    { id: "er", label: "ER Diagram", icon: Database, epic: "Epic 1" },
    { id: "viz", label: "Data Visualization", icon: BarChart3, epic: "Epic 2" },
    { id: "preprocess", label: "Preprocessing Board", icon: RefreshCw, epic: "Epic 3" },
    { id: "sandbox", label: "Model Sandbox", icon: Brain, epic: "Epic 4" },
    { id: "predict", label: "Live Prediction", icon: CheckCircle, epic: "Epic 5" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans flex flex-col justify-between">
      
      {/* Top Banner & Title Bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                Credit Card & Loan Approval prediction System
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Full-Stack Machine Learning Workspace & Explanatory AI Interface
              </p>
            </div>
          </div>

          {/* Core Tools reference list */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Core Tech Stack:
            </span>
            {tools.slice(4).map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold bg-slate-50 border border-slate-150 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/20 hover:border-indigo-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
              >
                {tool.name}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-8">
        
        {/* ML Workflow Stepper Progress */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Machine Learning Engineering Workflow Pipeline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tabList.map((tab, idx) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabID)}
                  className={`relative p-3.5 rounded-xl text-left border cursor-pointer transition-all ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {tab.epic}
                    </span>
                  </div>
                  <div className="font-bold text-xs leading-tight">{tab.label}</div>
                  
                  {/* Step Connector */}
                  {idx < tabList.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content visual board */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "er" && <ErDiagram />}
              {activeTab === "viz" && <DataVisualization />}
              {activeTab === "preprocess" && <DataPreprocessing />}
              {activeTab === "sandbox" && <ModelSandbox />}
              {activeTab === "predict" && <PredictionEngine />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Tech Stack Reference Directory Banner (Epic 1 story details) */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-1 space-y-2">
            <h4 className="font-bold text-sm text-slate-800">ML Pipeline References</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore the core development ecosystem, from package compilation to visualizers. Click to view online docs.
            </p>
          </div>
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50/50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 p-3 rounded-xl transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-slate-700 flex items-center justify-between">
                  {tool.name}
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block leading-tight">{tool.desc}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-50 mt-6 pt-4 text-center text-xs text-slate-400">
          Loan & Credit Card Approval Prediction System • Crafted for Enterprise Risk Management & Machine Learning Classifiers
        </div>
      </footer>
    </div>
  );
}

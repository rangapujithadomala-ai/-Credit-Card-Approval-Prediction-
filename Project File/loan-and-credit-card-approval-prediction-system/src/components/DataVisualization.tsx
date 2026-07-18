import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Grid3X3, Sparkles, AlertCircle, Info } from "lucide-react";

export default function DataVisualization() {
  const [activeUnivariateTab, setActiveUnivariateTab] = useState<"occupation" | "education">("occupation");
  const [selectedCorrelation, setSelectedCorrelation] = useState<{ x: string; y: string; val: number; desc: string } | null>({
    x: "Age",
    y: "Employment Days",
    val: 0.61,
    desc: "A positive correlation of +0.61 indicates that older applicants tend to have longer job tenures. This is financially intuitive and indicates higher employment stability for credit scoring.",
  });

  // Univariate Datasets
  const occupationData = [
    { name: "Laborers", count: 2845, percentage: 33.1, color: "bg-indigo-500" },
    { name: "Core Staff", count: 1824, percentage: 21.2, color: "bg-indigo-400" },
    { name: "Sales Staff", count: 1240, percentage: 14.4, color: "bg-teal-500" },
    { name: "Managers", count: 985, percentage: 11.5, color: "bg-teal-400" },
    { name: "Drivers", count: 720, percentage: 8.4, color: "bg-emerald-500" },
    { name: "High-tech Staff", count: 480, percentage: 5.6, color: "bg-emerald-400" },
    { name: "Others", count: 506, percentage: 5.8, color: "bg-slate-400" },
  ];

  const educationData = [
    { name: "Secondary / secondary special", count: 5210, percentage: 60.6, color: "bg-cyan-500" },
    { name: "Higher education", count: 2480, percentage: 28.8, color: "bg-cyan-400" },
    { name: "Incomplete higher", count: 620, percentage: 7.2, color: "bg-indigo-500" },
    { name: "Lower secondary", count: 240, percentage: 2.8, color: "bg-indigo-400" },
    { name: "Academic degree", count: 50, percentage: 0.6, color: "bg-slate-500" },
  ];

  // Multivariate Correlation Data
  const correlationVariables = ["Income", "Age", "Employment Days", "Family Members"];
  
  const correlationMatrix: Record<string, Record<string, { val: number; desc: string }>> = {
    "Income": {
      "Income": { val: 1.0, desc: "Self-correlation. Representing perfect positive association of the applicant's annual income." },
      "Age": { val: 0.08, desc: "Slight positive correlation. Income tends to grow slowly with age, but is highly distributed across all brackets." },
      "Employment Days": { val: 0.12, desc: "Mild positive correlation. Long-term employment is associated with higher average salary levels." },
      "Family Members": { val: 0.03, desc: "Extremely low correlation. Household size has very little direct relation to the applicant's income levels." }
    },
    "Age": {
      "Income": { val: 0.08, desc: "Slight positive correlation. Income tends to grow slowly with age, but is highly distributed across all brackets." },
      "Age": { val: 1.0, desc: "Self-correlation. Represents the perfect positive association of applicant age in years." },
      "Employment Days": { val: 0.61, desc: "A positive correlation of +0.61 indicates that older applicants tend to have longer job tenures. This is financially intuitive and indicates higher employment stability for credit scoring." },
      "Family Members": { val: -0.21, desc: "Negative correlation of -0.21. Older applicants generally have fewer dependents or children living at home compared to younger families." }
    },
    "Employment Days": {
      "Income": { val: 0.12, desc: "Mild positive correlation. Long-term employment is associated with higher average salary levels." },
      "Age": { val: 0.61, desc: "A positive correlation of +0.61 indicates that older applicants tend to have longer job tenures. This is financially intuitive and indicates higher employment stability for credit scoring." },
      "Employment Days": { val: 1.0, desc: "Self-correlation. Perfect positive association of total employment days." },
      "Family Members": { val: -0.15, desc: "Slight negative correlation. Longer-tenured employees are typically older and have fewer dependent family members." }
    },
    "Family Members": {
      "Income": { val: 0.03, desc: "Extremely low correlation. Household size has very little direct relation to the applicant's income levels." },
      "Age": { val: -0.21, desc: "Negative correlation of -0.21. Older applicants generally have fewer dependents or children living at home compared to younger families." },
      "Employment Days": { val: -0.15, desc: "Slight negative correlation. Longer-tenured employees are typically older and have fewer dependent family members." },
      "Family Members": { val: 1.0, desc: "Self-correlation. Perfect positive association of family members." }
    }
  };

  // Descriptive Statistics Dataset (mimics df.describe() output)
  const statisticsData = [
    { measure: "Count", income: "8,600.00", age: "8,600.00", employmentDays: "8,600.00", familyMembers: "8,600.00", openMonth: "8,600.00" },
    { measure: "Mean", income: "186,890.50", age: "43.78", employmentDays: "2,241.40", familyMembers: "2.13", openMonth: "14.25" },
    { measure: "Std Dev", income: "101,235.80", age: "11.52", employmentDays: "2,384.10", familyMembers: "0.91", openMonth: "8.65" },
    { measure: "Min", income: "27,000.00", age: "21.00", employmentDays: "0.00 (Unemployed)", familyMembers: "1.00", openMonth: "1.00" },
    { measure: "25% (Q1)", income: "121,500.00", age: "34.00", employmentDays: "410.00", familyMembers: "2.00", openMonth: "7.00" },
    { measure: "50% (Median)", income: "157,500.00", age: "43.00", employmentDays: "1,460.00", familyMembers: "2.00", openMonth: "13.00" },
    { measure: "75% (Q3)", income: "225,000.00", age: "53.00", employmentDays: "3,150.00", familyMembers: "3.00", openMonth: "21.00" },
    { measure: "Max", income: "1,575,000.00", age: "69.00", employmentDays: "15,710.00", familyMembers: "15.00", openMonth: "60.00" },
  ];

  const handleCorrelationClick = (x: string, y: string) => {
    const data = correlationMatrix[x][y];
    setSelectedCorrelation({
      x,
      y,
      val: data.val,
      desc: data.desc
    });
  };

  return (
    <div className="space-y-10">
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Univariate Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800 text-lg">Univariate Attribute Distributions</h3>
              </div>
              <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => setActiveUnivariateTab("occupation")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeUnivariateTab === "occupation"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Occupation
                </button>
                <button
                  onClick={() => setActiveUnivariateTab("education")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeUnivariateTab === "education"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Education
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Analyzing single features independently helps identify categorical skew and class representation levels. Here is the distribution of 
              <strong className="text-slate-700"> {activeUnivariateTab === "occupation" ? "OCCUPATION_TYPE" : "NAME_EDUCATION_TYPE"}</strong>.
            </p>

            {/* Simulated bar chart with percentage widths */}
            <div className="space-y-4">
              {(activeUnivariateTab === "occupation" ? occupationData : educationData).map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="font-mono text-slate-400">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              {activeUnivariateTab === "occupation"
                ? "Note: Unskilled laborers make up the largest sector of applicants, which correlates directly with lower average approval margins. Managers represent low-risk targets."
                : "Higher education credentials represent a major positive feature with highly linear correlations to low payment default rates."}
            </span>
          </div>
        </div>

        {/* Multivariate Heatmap Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800 text-lg">Multivariate Correlation Heatmap</h3>
              </div>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                Interactive Heatmap
              </span>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Click on any correlation block in the matrix to view its data science description and financial correlation value.
            </p>

            {/* Matrix Visual Grid */}
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px] mb-6">
              <div />
              {correlationVariables.map((v) => (
                <div key={v} className="font-semibold text-slate-500 py-1 text-center text-[10px]">
                  {v}
                </div>
              ))}

              {correlationVariables.map((row) => (
                <>
                  <div key={row} className="font-semibold text-slate-500 text-left self-center text-[10px]">
                    {row}
                  </div>
                  {correlationVariables.map((col) => {
                    const correlation = correlationMatrix[row][col];
                    const val = correlation.val;
                    
                    // Determine color based on value
                    let cellBg = "bg-slate-100 hover:bg-slate-200 text-slate-800";
                    if (val === 1.0) {
                      cellBg = "bg-indigo-600 text-white";
                    } else if (val > 0.5) {
                      cellBg = "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-200";
                    } else if (val > 0.05) {
                      cellBg = "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-100";
                    } else if (val < 0) {
                      cellBg = "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-100";
                    }

                    const isSelected = selectedCorrelation?.x === row && selectedCorrelation?.y === col;

                    return (
                      <motion.button
                        key={`${row}-${col}`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleCorrelationClick(row, col)}
                        className={`h-12 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${cellBg} ${
                          isSelected ? "ring-2 ring-indigo-500 shadow-md transform scale-[1.05]" : ""
                        }`}
                      >
                        {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                      </motion.button>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {/* Selection Insight Block */}
          {selectedCorrelation && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-indigo-300 uppercase">
                    {selectedCorrelation.x} × {selectedCorrelation.y}
                  </span>
                  <span className="text-xs font-bold font-mono bg-slate-800 px-1.5 py-0.5 rounded text-white">
                    {selectedCorrelation.val >= 0 ? `+${selectedCorrelation.val}` : selectedCorrelation.val}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedCorrelation.desc}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descriptive Statistics Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-lg">Descriptive Statistical Analysis</h3>
          </div>
          <span className="text-xs font-mono bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
            Pandas app.describe() Output
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Summarizing statistical properties is the first step in assessing ranges, standard deviations, and identifying outliers. Below are the metrics computed for the numerical columns.
        </p>

        {/* Responsive Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-mono tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Statistical Measure</th>
                  <th className="px-4 py-3 font-semibold text-right">Income (USD)</th>
                  <th className="px-4 py-3 font-semibold text-right">Age (Years)</th>
                  <th className="px-4 py-3 font-semibold text-right">Employment Days</th>
                  <th className="px-4 py-3 font-semibold text-right">Family Members</th>
                  <th className="px-4 py-3 font-semibold text-right">Open Month Offset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {statisticsData.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 font-sans">{stat.measure}</td>
                    <td className="px-4 py-3 text-right text-indigo-600 font-semibold">{stat.income}</td>
                    <td className="px-4 py-3 text-right text-teal-600">{stat.age}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{stat.employmentDays}</td>
                    <td className="px-4 py-3 text-right text-amber-600">{stat.familyMembers}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{stat.openMonth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

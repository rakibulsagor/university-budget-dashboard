import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DEFAULT_DATA = [
  { id: "DU", name: "Dhaka University", budget: 10354500000, students: 37018 },
  { id: "RU", name: "Rajshahi University", budget: 5643400000, students: 35000 },
  { id: "JNU", name: "Jagannath University", budget: 2978200000, students: 12000 },
  { id: "JU", name: "Jahangirnagar University", budget: 3233500000, students: 19000 },
  { id: "KU", name: "Khulna University", budget: 0, students: 10000 },
  { id: "CU", name: "Chittagong University", budget: 0, students: 25000 },
];

export default function UniversityBudgetDashboard() {
  const [rows, setRows] = useState(DEFAULT_DATA);

  function updateRow(id, field, value) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: field === "name" ? value : Number(value) } : r))
    );
  }

  function formattedTk(v) {
    if (!v && v !== 0) return "-";
    return "Tk " + Number(v).toLocaleString();
  }

  function perStudent(row) {
    const b = Number(row.budget || 0);
    const s = Number(row.students || 0);
    if (!s) return 0;
    return Math.round(b / s);
  }

  function downloadCSV() {
    const header = ["University", "Budget_Tk", "Students", "Per_Student_Tk"];
    const lines = [header.join(",")];
    rows.forEach((r) => {
      lines.push([r.name, r.budget || 0, r.students || 0, perStudent(r)].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "university_budget_per_student.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartData = rows.map((r) => ({ name: r.id, per: perStudent(r) }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">University Budget — Per Student Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Edit university names, budgets (Tk), and student numbers. Per-student budget updates automatically.
          </p>
        </header>

        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-700">
                <th className="p-2">University</th>
                <th className="p-2">Budget (Tk)</th>
                <th className="p-2">Students</th>
                <th className="p-2">Per Student (Tk / year)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 font-medium">
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => updateRow(r.id, "name", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={r.budget || ""}
                      onChange={(e) => updateRow(r.id, "budget", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Total annual budget in Tk"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={r.students || ""}
                      onChange={(e) => updateRow(r.id, "students", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Number of regular students"
                    />
                  </td>
                  <td className="p-2">{formattedTk(perStudent(r))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-end mt-4 gap-3">
            <button
              onClick={() => setRows(DEFAULT_DATA)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="font-semibold mb-3">Per-Student Comparison</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => (v ? `Tk ${v / 1000}k` : "0")} />
                  <Tooltip formatter={(v) => `Tk ${Number(v).toLocaleString()}`} />
                  <Bar dataKey="per" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Per-student value = budget ÷ students (rounded).
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="font-semibold mb-3">Summary</h2>
            <ul className="space-y-2 text-sm">
              {rows.map((r) => (
                <li key={r.id} className="flex justify-between">
                  <span>{r.name}</span>
                  <span className="font-medium">{formattedTk(perStudent(r))} / year</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-6 text-xs text-gray-500">
          <p>
            Built for quick comparison: RU (Rajshahi University), JNU (Jagannath University), JU
            (Jahangirnagar University), KU (Khulna University), DU (Dhaka University), CU
            (Chittagong University).
          </p>
        </footer>
      </div>
    </div>
  );
}

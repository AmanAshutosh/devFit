import * as XLSX from "xlsx";

export const exportFullReport = (exercises, supplements, dietHistory, user) => {
  const wb = XLSX.utils.book_new();
  const colWidth = (w) => ({ wch: w });

  // ── Sheet 1: Profile & BMI ──
  const feet = user.heightFeet || 0;
  const inches = user.heightInches || 0;
  const totalInches = feet * 12 + inches;
  const heightM = totalInches * 0.0254;
  const bmi =
    user.weight && heightM
      ? parseFloat((user.weight / (heightM * heightM)).toFixed(1))
      : "—";
  const bmiCat =
    typeof bmi === "number"
      ? bmi < 18.5
        ? "Underweight"
        : bmi < 25
          ? "Normal"
          : bmi < 30
            ? "Overweight"
            : "Obese"
      : "—";

  const profileData = [
    ["devFit — User Report", "", ""],
    ["Generated on", new Date().toLocaleString("en-IN"), ""],
    ["", "", ""],
    ["PERSONAL INFO", "", ""],
    ["Name", user.name || "—", ""],
    ["Email", user.email || "—", ""],
    ["Username", `@${user.username || "—"}`, ""],
    ["Age", user.age || "—", ""],
    [
      "Member Since",
      user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN")
        : "—",
      "",
    ],
    ["Streak", `${user.streak || 0} days`, ""],
    ["", "", ""],
    ["BODY MEASUREMENTS", "", ""],
    ["Weight", `${user.weight || "—"} kg`, ""],
    ["Height", `${feet}' ${inches}"`, `(${heightM.toFixed(2)} m)`],
    ["BMI", bmi, bmiCat],
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
  wsProfile["!cols"] = [colWidth(24), colWidth(22), colWidth(18)];
  XLSX.utils.book_append_sheet(wb, wsProfile, "Profile & BMI");

  // ── Sheet 2: Exercises ──
  if (exercises.length > 0) {
    const exData = [
      [
        "Date",
        "Exercise",
        "Muscle Group",
        "Weight (kg)",
        "Reps",
        "Sets",
        "Volume (kg)",
        "Notes",
      ],
      ...exercises.map((ex) => [
        new Date(ex.date).toLocaleDateString("en-IN"),
        ex.name,
        ex.muscleGroup || "—",
        ex.weight || 0,
        ex.reps,
        ex.sets,
        (ex.weight || 0) * ex.reps * ex.sets,
        ex.notes || "",
      ]),
    ];
    const wsEx = XLSX.utils.aoa_to_sheet(exData);
    wsEx["!cols"] = [
      colWidth(14),
      colWidth(24),
      colWidth(16),
      colWidth(12),
      colWidth(8),
      colWidth(8),
      colWidth(14),
      colWidth(24),
    ];
    XLSX.utils.book_append_sheet(wb, wsEx, "Exercises");
  }

  // ── Sheet 3: Supplements ──
  if (supplements.length > 0) {
    const suppData = [
      ["Date", "Time", "Supplement", "Quantity", "Notes"],
      ...supplements.map((s) => [
        new Date(s.date).toLocaleDateString("en-IN"),
        s.time,
        s.name,
        s.quantity,
        s.notes || "",
      ]),
    ];
    const wsSupp = XLSX.utils.aoa_to_sheet(suppData);
    wsSupp["!cols"] = [
      colWidth(14),
      colWidth(10),
      colWidth(20),
      colWidth(16),
      colWidth(24),
    ];
    XLSX.utils.book_append_sheet(wb, wsSupp, "Supplements");
  }

  // ── Sheet 4: Diet History ──
  if (dietHistory.length > 0) {
    const dietData = [
      ["Date", "Calories (kcal)", "Protein (g)", "Carbs (g)", "Fats (g)"],
      ...dietHistory.map((d) => [
        new Date(d.date).toLocaleDateString("en-IN"),
        d.totalCalories,
        d.totalProtein,
        d.totalCarbs,
        d.totalFats,
      ]),
    ];
    const wsDiet = XLSX.utils.aoa_to_sheet(dietData);
    wsDiet["!cols"] = [
      colWidth(14),
      colWidth(16),
      colWidth(14),
      colWidth(14),
      colWidth(12),
    ];
    XLSX.utils.book_append_sheet(wb, wsDiet, "Diet History");
  }

  const filename = `devfit_report_${user.username || "user"}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

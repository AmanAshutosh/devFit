export const calculateBMI = (weightKg, feet, inches) => {
  if (!weightKg || !feet) return null;
  const totalInches = Number(feet) * 12 + Number(inches || 0);
  const heightInMeters = totalInches * 0.0254;
  const heightSquared = heightInMeters * heightInMeters;
  const bmi = Number(weightKg) / heightSquared;
  return parseFloat(bmi.toFixed(1));
};

export const getBMICategory = (bmi) => {
  const b = parseFloat(bmi);
  if (!b || isNaN(b)) return { label: "—", color: "#999", range: "" };
  if (b < 18.5)
    return { label: "Underweight", color: "#3b82f6", range: "< 18.5" };
  if (b < 25)
    return { label: "Normal", color: "#22c55e", range: "18.5 – 24.9" };
  if (b < 30)
    return { label: "Overweight", color: "#f59e0b", range: "25 – 29.9" };
  return { label: "Obese", color: "#ef4444", range: "≥ 30" };
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const todayISO = () => new Date().toISOString().split("T")[0];

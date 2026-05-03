import React from "react";

const SkillBadge = ({ skill, type = "default" }) => {
  const styles = {
    default: "bg-blue-50 text-blue-600 border border-blue-100",
    matched: "bg-green-50 text-green-600 border border-green-100",
    missing: "bg-red-50 text-red-500 border border-red-100",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${styles[type]}`}>
      {type === "matched" && "\u2713 "}
      {type === "missing" && "\u2717 "}
      {skill}
    </span>
  );
};

export default SkillBadge;

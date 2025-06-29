import React from "react";

interface ProgressStepsProps {
  step: number;
  total: number;
}

const stepsLabel = ["성별", "나이", "사진", "분석"];

const ProgressSteps = ({ step, total }: ProgressStepsProps) => (
  <div className="flex gap-2 items-center justify-center mb-4">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${i === step ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          {i + 1}
        </div>
        <div className="text-[11px] mt-1 text-center">
          {stepsLabel[i]}
        </div>
      </div>
    ))}
  </div>
);

export default ProgressSteps;
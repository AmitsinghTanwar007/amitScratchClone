import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Movex({ id }) {
  const { stepInXValues, setStepInX } = useContext(Getcontext);
  const [step, setStep] = useState(2);

  useEffect(() => {
    if (stepInXValues[id] !== undefined||NaN) {
      setStep(stepInXValues[id]);
    }
  }, [stepInXValues, id]);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setStep(newValue);
    setStepInX(id, newValue);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { id: 1 }, // Identifier for Movex
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`move-1 flex gap-1 bg-blue-500 w-[20vw] px-2 py-2 rounded-md cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
      ref={drag}
    >
      <div>Move</div>
      <input
        type="number"
        className="rounded-lg w-[20%] text-xs h-[4vh] text-black px-2"
        value={step}
        onChange={handleChange}
      />
      <div>steps in X direction</div>
    </div>
  );
}

export default Movex;

import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Movey({ id }) {
  const { stepInYValues, setStepInY } = useContext(Getcontext);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (stepInYValues[id] !== undefined) {
      setStep(stepInYValues[id]);
    }
  }, [stepInYValues, id]);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setStep(newValue);
    setStepInY(id, newValue);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { id: 2 }, // Identifier for Movey
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
      <div>steps in Y direction</div>
    </div>
  );
}

export default Movey;

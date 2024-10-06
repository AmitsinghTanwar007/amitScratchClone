import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function Repeatation({ id }) {
  const { Repeat, setRepeatValue } = useContext(Getcontext);
  const [step, setStep] = useState(2);

  useEffect(() => {
    if (Repeat[id] !== undefined) {
      setStep(Repeat[id]);
    }
  }, [Repeat, id]);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setStep(newValue);
    setRepeatValue(id, newValue);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { id: 5 }, // Identifier for Repeatation
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
      <div>Repeat for</div>
      <input
        type="text"
        className="rounded-lg w-[20%] text-xs h-[4vh] text-black px-2"
        value={step}
        onChange={handleChange}
      />
    </div>
  );
}

export default Repeatation;

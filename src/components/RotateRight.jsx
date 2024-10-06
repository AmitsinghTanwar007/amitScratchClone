import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import Getcontext from "../context/Getcontext";

function RotateRight({ id }) {
  const { setRotationRight, rotationInRight } = useContext(Getcontext);
  const [step, setstep] = useState(2);

  useEffect(() => {
    if (rotationInRight[id] !== undefined) {
      setstep(rotationInRight[id]);
    }
  }, [rotationInRight, id]);

  const handleChange = (e) => {
    const degrees = Number(e.target.value);
    setstep(degrees);
    setRotationRight(id, degrees);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { id: 3 }, // Identifier for RotateRight
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
      <div>Rotate</div>
      <input
        type="number"
        className="rounded-lg w-[20%] text-xs h-[4vh] text-black px-2"
        value={step}
        onChange={handleChange}
      />
      <div>degree in right direction</div>
    </div>
  );
}

export default RotateRight;

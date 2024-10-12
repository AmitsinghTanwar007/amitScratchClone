import React, { useState, useContext, useEffect } from "react";
import Getcontext from "../context/Getcontext";
import { useDrag } from "react-dnd"; // Import useDrag from react-dnd

function Goto({ id }) {
  const { gotoValues, setGoto, getGotoValues } = useContext(Getcontext);
  const [x, setX] = useState(0); // Default value for X
  const [y, setY] = useState(0); // Default value for Y

  // Load existing X and Y values from context when the component mounts or when ID changes
  useEffect(() => {
    const values = getGotoValues(id);
    if (values) {
      setX(values.x !== undefined ? values.x : 2); // Set X value
      setY(values.y !== undefined ? values.y : 2); // Set Y value
    }
  }, [id, getGotoValues]);

  // Handle changes to X input
  const handleXChange = (e) => {
    const newXValue = Number(e.target.value);
    setX(newXValue); // Update local state for X
    setGoto(id, newXValue, y); // Update context with new X and existing Y
  };

  // Handle changes to Y input
  const handleYChange = (e) => {
    const newYValue = Number(e.target.value);
    setY(newYValue); // Update local state for Y
    setGoto(id, x, newYValue); // Update context with new Y and existing X
  };

  // Define drag functionality for the component
  const [{ isDragging }, drag] = useDrag({
    type: "component", // Define the drag type
    item: { id: 6 }, // Change ID as necessary
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`move-1 flex gap-1 bg-blue-500 w-[20vw] px-2 py-2 rounded-md cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
      ref={drag} // Attach drag ref here
    >
      <div>Goto: X</div>
      <input
        type="number"
        className="rounded-lg w-[20%] text-xs h-[4vh] text-black px-2"
        value={x}
        onChange={handleXChange} // Handle X changes
      />
      <div>Y</div>
      <input
        type="number"
        className="rounded-lg w-[20%] text-xs h-[4vh] text-black px-2"
        value={y}
        onChange={handleYChange} // Handle Y changes
      />
    </div>
  );
}

export default Goto;

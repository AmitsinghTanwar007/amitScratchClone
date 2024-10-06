import React, { useContext } from "react";
import { useDrag } from "react-dnd";
import Movex from "./Movex";
import Movey from "./Movey";
import Getcontext from "../context/Getcontext";
import RotateRight from "./RotateRight";
import RotateLeft from "./RotateLeft";
import Repeatation from "./Repeatation";
import Goto from "./Goto";

const ItemType = {
  COMPONENT: "component", // Define item type for dragging
};

function Sidebar({ id }) {
  const { midArrays, deleteFromMidArray } = useContext(Getcontext);
  const midarray = midArrays[id] || [];

  const componentsArray = [
    { id: 1, component: <Movex />, name: "Movex" },
    { id: 2, component: <Movey />, name: "Movey" },
    { id: 3, component: <RotateRight />, name: "RotateRight" },
    { id: 4, component: <RotateLeft />, name: "RotateLeft" },
    { id: 6, component: <Goto />, name: "Goto" },
    { id: 5, component: <Repeatation />, name: "Repeatation" },
  ];

  return (
    <div className="min:h-[100vh] w-[23%] rounded-lg bg-slate-200 overflow-auto px-2 text-white border-[2px] py-5 border-black">
      <div className="mb-7 text-black text-2xl">SideBar</div>
      <h1 className="mb-3 text-black text-lg">Motion</h1>
      <div>
        {componentsArray.map((item) => {
          // Create a draggable component
          const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemType.COMPONENT,
            item: { id: item.id }, // Data to pass to drop target
            collect: (monitor) => ({
              isDragging: !!monitor.isDragging(),
            }),
          }));

          return (
            <div
              key={item.id}
              ref={drag} // Attach the drag ref to the item
              className={`block w-full mb-2 text-left ${
                isDragging ? "opacity-50" : ""
              }`}
            >
              {item.id === 5 ? ( // Wrap only Repeatation in a div labeled Control
                <div>
                  <h2 className="text-black text-lg">Control</h2>
                  {item.component}
                </div>
              ) : (
                item.component // Render other components normally
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;

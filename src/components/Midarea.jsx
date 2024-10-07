import React, { useContext, useEffect, useState } from "react";
import Getcontext from "../context/Getcontext";
import Movex from "./Movex";
import Movey from "./Movey";
import RotateRight from "./RotateRight";
import RotateLeft from "./RotateLeft";
import Repeatation from "./Repeatation";
import Goto from "./Goto";
import { useDrop } from "react-dnd";

function Midarea({ id }) {
  const {
    midArrays,
    stepInXValues,
    stepInYValues,
    rotationInRight,
    rotationInLeft,
    getCurrentSpriteValues,
    updateSpriteXPosition,
    updateSpriteYPosition,
    updateSpriteRightRotation,
    updateSpriteLeftRotation,
    Repeat,
    sprites,
    setSprites,
    getGotoValues,
    insertIntoMidArray,
    deleteFromMidArray,
    moveComponent,
  } = useContext(Getcontext);

  const midarray = midArrays[id] || [];
  const [clickedButtons, setClickedButtons] = useState({});

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites]);

  const resetSprite = () => {
    console.log(id);
    const value1 = 0;
    updateSpriteXPosition(id, value1);
    updateSpriteYPosition(id, value1);
    updateSpriteRightRotation(id, value1);
    console.log(`Sprite ${id} reset to (x: 0, y: 0, angle: 0)`);
  };

  // Function to handle button click
  const handleButtonClick = (item) => {
    setClickedButtons((prev) => ({ ...prev, [item]: true }));
    setTimeout(() => {
      setClickedButtons((prev) => ({ ...prev, [item]: false }));
    }, 300);
  };

  // Function to handle individual component click actions
  const handleComponentClick = (item) => {
    setSprites((prevSprites) => {
      const updatedSprites = [...prevSprites];
      const currentSprite =
        updatedSprites.find((sprite) => sprite.id === id) || {};

      switch (item) {
        case 1: {
          const newX =
            (currentSprite.position?.x || 0) + (stepInXValues[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { ...sprite.position, x: newX } }
              : sprite
          );
        }
        case 2: {
          const newY =
            (currentSprite.position?.y || 0) + (stepInYValues[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { ...sprite.position, y: newY } }
              : sprite
          );
        }
        case 3: {
          const newRotation =
            (currentSprite.angle || 0) + (rotationInRight[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id ? { ...sprite, angle: newRotation } : sprite
          );
        }
        case 4: {
          const newRotation =
            (currentSprite.angle || 0) - (rotationInLeft[id] || 0);
          return updatedSprites.map((sprite) =>
            sprite.id === id ? { ...sprite, angle: newRotation } : sprite
          );
        }
        case 6: {
          const { x, y } = getGotoValues(id);
          return updatedSprites.map((sprite) =>
            sprite.id === id
              ? { ...sprite, position: { x: x || 0, y: y || 0 } }
              : sprite
          );
        }
        default:
          return updatedSprites; // No change if unrecognized action
      }
    });
  };

  const handleRun = async () => {
    const midarray = midArrays[id] || [];
    if(midarray.includes(5)){
      const repeatCount=Repeat[id];
    }
    else{
      const repeatCount = 1;
    }

    for (let repeat = 0; repeat < repeatCount; repeat++) {
      for (let item of midarray) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setSprites((prevSprites) => {
              const updatedSprites = [...prevSprites];
              const currentSprite =
                updatedSprites.find((sprite) => sprite.id === id) || {};

              switch (item) {
                case 1: {
                  const newX =
                    (currentSprite.position?.x || 0) + (stepInXValues[id] || 0);
                  return updatedSprites.map((sprite) =>
                    sprite.id === id
                      ? { ...sprite, position: { ...sprite.position, x: newX } }
                      : sprite
                  );
                }
                case 2: {
                  const newY =
                    (currentSprite.position?.y || 0) + (stepInYValues[id] || 0);
                  return updatedSprites.map((sprite) =>
                    sprite.id === id
                      ? { ...sprite, position: { ...sprite.position, y: newY } }
                      : sprite
                  );
                }
                case 3: {
                  const newRotation =
                    (currentSprite.angle || 0) + (rotationInRight[id] || 0);
                  return updatedSprites.map((sprite) =>
                    sprite.id === id
                      ? { ...sprite, angle: newRotation }
                      : sprite
                  );
                }
                case 4: {
                  const newRotation =
                    (currentSprite.angle || 0) - (rotationInLeft[id] || 0);
                  return updatedSprites.map((sprite) =>
                    sprite.id === id
                      ? { ...sprite, angle: newRotation }
                      : sprite
                  );
                }
                case 6: {
                  const { x, y } = getGotoValues(id);
                  return updatedSprites.map((sprite) =>
                    sprite.id === id
                      ? { ...sprite, position: { x: x || 0, y: y || 0 } }
                      : sprite
                  );
                }
                default:
                  return updatedSprites; // No change if unrecognized action
              }
            });
            resolve();
          }, 500);
        });
      }
    }
  };

  const componentMap = {
    1: Movex,
    2: Movey,
    3: RotateRight,
    4: RotateLeft,
    5: Repeatation,
    6: Goto,
  };

  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item) => {
      if (!midarray.includes(item.id)) {
        insertIntoMidArray(id, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [, dropForReorder] = useDrop({
    accept: "component",
    hover: (item, monitor) => {
      const dragIndex = midarray.indexOf(item.id);
      const hoverIndex = monitor.getClientOffset(); // Replace with actual calculation based on mouse position

      if (dragIndex !== -1 && hoverIndex !== -1 && dragIndex !== hoverIndex) {
        moveComponent(id, dragIndex, hoverIndex);
      }
    },
  });

  const [{ isOverOutside }, dropOutside] = useDrop({
    accept: "component",
    drop: (item) => {
      deleteFromMidArray(id, item.id);
    },
    collect: (monitor) => ({
      isOverOutside: !!monitor.isOver(),
    }),
  });

  return (
    <div className="w-[38%] p-4 text-white min-h-[100vh] flex flex-col overflow-auto bg-slate-100 rounded-lg border-black gap-4 items-center">
      <div className="text-black text-2xl mb-[10%]">Mid Area</div>

      <div
        ref={(node) => drop(dropForReorder(node))} // Attach reorder drop target
        className="droparea bg-slate-100 py-3 min-h-[30vh] px-5 overflow-auto rounded-lg justify-center items-center border-[2px] border-black gap-4"
      >
        {midarray.length === 0 ? (
          <div className="text-gray-500 w-[20vw] py-4 px-6 overflow-auto">
            Drop here
          </div>
        ) : (
          midarray.map((item) => {
            const Component = componentMap[item];
            return Component ? (
              <div
                key={item}
                style={{ cursor: "move" }}
                className="draggable-component transition-all mb-4 duration-300"
              >
                <button
                  onClick={() => {
                    handleButtonClick(item);
                    handleComponentClick(item); // Call the component click action
                  }} // Use the new handleButtonClick
                  className={`w-full bg-blue-300 p-2 rounded transition-transform duration-300 ${
                    clickedButtons[item] ? "scale-95" : ""
                  }`}
                >
                  <Component id={id} />
                </button>
              </div>
            ) : null;
          })
        )}
      </div>

      <div
        ref={dropOutside}
        className="border-dashed border-2 border-red-500 text-red-500 p-2 mt-2 w-full flex justify-center"
      >
        {isOverOutside ? (
          <span>Release to delete</span>
        ) : (
          <span>Drag here to remove</span>
        )}
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={() => {
            handleButtonClick("run");
            handleRun(); // Call the run logic
          }}
          className={`w-[50%] bg-green-500 p-2 rounded transition-transform duration-300 ${
            clickedButtons["run"] ? "scale-95" : ""
          }`}
        >
          Run
        </button>

        <button
          onClick={() => {
            handleButtonClick("reset");
            resetSprite(); // Call the reset logic
          }}
          className={`w-[50%] bg-red-500 p-2 rounded transition-transform duration-300 ${
            clickedButtons["reset"] ? "scale-95" : ""
          }`}
        >
          Reset Sprite
        </button>
      </div>
      <div className="text-sm bg-slate-500 text-white p-2 rounded-md ">
        if you want to see hero animation just use two different images, Run all
        sprites button to see the hero animation
      </div>
    </div>
  );
}

export default Midarea;

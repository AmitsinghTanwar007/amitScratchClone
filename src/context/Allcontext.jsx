import React, { useState, useEffect } from "react";
import Getcontext from "./Getcontext";

function Allcontext(props) {
  const [spriteCount, setSpriteCount] = useState(0);
  const [curSprite, setCurSprite] = useState(null); // Current sprite
  const [sprites, setSprites] = useState([]); // List of sprites

  // Object where each sprite ID will have its own midArray
  const [midArrays, setMidArrays] = useState({});

  // Object to store stepInX values associated with each sprite ID
  const [stepInXValues, setStepInXValues] = useState({});

  // Object to store stepInY values associated with each sprite ID
  const [stepInYValues, setStepInYValues] = useState({});

  // Object to store Goto x and y values for each sprite ID
  const [gotoValues, setGotoValues] = useState({}); // <-- Goto state

  const [collision, setCollision] = useState(false);

  // Object to store rotation values associated with each sprite ID
  const [rotationInRight, setRotationInRight] = useState({});
  const [rotationInLeft, setRotationInLeft] = useState({}); // New object for left rotation

  const [Repeat, setRepeat] = useState({}); // State for repeat values

  const [updatepreview, setupdatepreview] = useState(true);

  const setupdatepreviewvalue = () => {
    setupdatepreview(!updatepreview);
    return updatepreview;
  };

  // Function to insert an element into the midarray for a specific id
  const insertIntoMidArray = (id, element) => {
    setMidArrays((prevMidArrays) => ({
      ...prevMidArrays,
      [id]: prevMidArrays[id] ? [...prevMidArrays[id], element] : [element],
    }));
  };

  // Function to delete an element from the midarray for a specific id
  const deleteFromMidArray = (id, element) => {
    setMidArrays((prevMidArrays) => ({
      ...prevMidArrays,
      [id]: prevMidArrays[id]?.filter((el) => el !== element) || [],
    }));
  };

  // Function to set or update Goto values for a specific sprite ID
  const setGoto = (id, xValue, yValue) => {
    setGotoValues((prevGotoValues) => ({
      ...prevGotoValues,
      [id]: { x: xValue, y: yValue },
    }));
  };

  // Function to get the current Goto values
  const getGotoValues = (id) => {
    return gotoValues[id] || { x: 0, y: 0 };
  };

  // Function to set or update stepInX value for a specific sprite ID
  const setStepInX = (id, value) => {
    setStepInXValues((prevStepInX) => ({
      ...prevStepInX,
      [id]: value,
    }));
  };

  // Function to set or update stepInY value for a specific sprite ID
  const setStepInY = (id, value) => {
    setStepInYValues((prevStepInY) => ({
      ...prevStepInY,
      [id]: value,
    }));
  };

  const updateSpriteXPosition = (id, newX) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === id
          ? { ...sprite, position: { ...sprite.position, x: newX } }
          : sprite
      )
    );
  };

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites]);

  // New function to update the y position of a sprite by ID
  const updateSpriteYPosition = (id, newY) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            position: {
              ...sprite.position,
              y: newY,
            },
          };
        }
        return sprite; // Return the original sprite if the id doesn't match
      });
      setupdatepreviewvalue();
      return updatedSprites; // Return the updated sprites
    });
  };

  // New function to update the right rotation of a sprite by ID
  const updateSpriteRightRotation = (id, newRotation) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            angle: newRotation, // Assuming 'angle' is the property storing rotation
          };
        }
        return sprite; // Return the original sprite if the id doesn't match
      });
      setupdatepreviewvalue();
      return updatedSprites; // Return the updated sprites
    });
  };

  // New function to update the left rotation of a sprite by ID
  const updateSpriteLeftRotation = (id, newRotation) => {
    setSprites((prevSprites) => {
      const updatedSprites = prevSprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            angle: newRotation, // Assuming 'angle' is the property storing rotation
          };
        }
        return sprite; // Return the original sprite if the id doesn't match
      });
      setupdatepreviewvalue();
      return updatedSprites; // Return the updated sprites
    });
  };

  // New function to set or update rotationInLeft value for a specific sprite ID
  const setRotationLeft = (id, value) => {
    setRotationInLeft((prevRotationInLeft) => ({
      ...prevRotationInLeft,
      [id]: value,
    }));
  };

  // New function to get the x, y, and rotation of the current sprite
  const getCurrentSpriteValues = (id) => {
    if (id) {
      const currentSprite = sprites.find((sprite) => sprite.id === id);
      if (currentSprite) {
        setupdatepreviewvalue();
        return {
          x: currentSprite.position.x,
          y: currentSprite.position.y,
          rotation: currentSprite.angle, // Assuming angle is the rotation value
        };
      }
    }
    return null; // Return null if curSprite is not set or not found
  };

  // Function to set or update rotationInRight value for a specific sprite ID
  const setRotationRight = (id, value) => {
    setRotationInRight((prevRotationInRight) => ({
      ...prevRotationInRight,
      [id]: value,
    }));
  };

  // Function to set the repeat value for a specific id directly
  const setRepeatValue = (id, value) => {
    setRepeat((prevRepeat) => ({
      ...prevRepeat,
      [id]: value, // Directly set the value for the specified id
    }));
  };

  const moveComponent = (spriteId, fromIndex, toIndex) => {
    setMidArrays((prevMidArrays) => {
      const updatedMidArray = [...prevMidArrays[spriteId]];
      const [movedItem] = updatedMidArray.splice(fromIndex, 1); // Remove the item from the original position
      updatedMidArray.splice(toIndex, 0, movedItem); // Insert it at the new position
      return { ...prevMidArrays, [spriteId]: updatedMidArray }; // Return the updated arrays
    });
  };

  // const [cooldowns, setCooldowns] = useState({}); // Cooldown tracking state
  // const cooldownDuration = 3000; // Cooldown duration in milliseconds

  const handleRunForAllSprites = async () => {
    const promises = Object.keys(sprites).map(async (key) => {
      const id = sprites[key].id;
      const midarray = midArrays[id] || [];
      let repeatCount=1;
      if (midarray.includes(5)) {
        repeatCount = Repeat[id];
      } 

      for (let repeat = 0; repeat < repeatCount; repeat++) {
        for (const item of midarray) {
          await new Promise((resolve) => {
            setTimeout(() => {
              setSprites((prevSprites) => {
                const updatedSprites = [...prevSprites];
                const currentSprite =
                  updatedSprites.find((sprite) => sprite.id === id) || {};

                switch (item) {
                  case 1: {
                    const newX =
                      (currentSprite.position?.x || 0) +
                      (stepInXValues[id] || 0);
                    const newSprites = updatedSprites.map((sprite) =>
                      sprite.id === id
                        ? {
                            ...sprite,
                            position: { ...sprite.position, x: newX },
                          }
                        : sprite
                    );
                    if (collision) {
                      swapSpritesIfClose(sprites);
                    }
                    return newSprites;
                  }
                  case 2: {
                    const newY =
                      (currentSprite.position?.y || 0) +
                      (stepInYValues[id] || 0);
                    const newSprites = updatedSprites.map((sprite) =>
                      sprite.id === id
                        ? {
                            ...sprite,
                            position: { ...sprite.position, y: newY },
                          }
                        : sprite
                    );
                    swapSpritesIfClose(newSprites);
                    return newSprites;
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
                    return updatedSprites;
                }
              });
              resolve();
            }, 500);
          });
        }
      }
    });

    await Promise.all(promises);
  };

  const swapSpritesIfClose = (updatedSprites) => {
    const spritesToCheck = [...updatedSprites];

    for (let i = 0; i < spritesToCheck.length; i++) {
      for (let j = i + 1; j < spritesToCheck.length; j++) {
        const spriteA = spritesToCheck[i];
        const spriteB = spritesToCheck[j];

        const distance = Math.sqrt(
          Math.pow(spriteA.position.x - spriteB.position.x, 2) +
            Math.pow(spriteA.position.y - spriteB.position.y, 2)
        );

        if (distance <= 80) {
          console.log(
            `Swapping sprites ${spriteA.id} and ${spriteB.id} due to proximity.`
          );

          // Generate new positions within your desired bounds
          const newX1 = Math.random() * 400;
          const newY1 = Math.random() * 400;
          const newX2 = Math.random() * 400;
          const newY2 = Math.random() * 400;

          // Update positions and IDs without creating new sprite objects unnecessarily
          const newSprites = spritesToCheck.map((sprite) => {
            if (sprite.id === spriteA.id) {
              return {
                ...sprite,
                id: spriteB.id,
                position: { x: newX1, y: newY1 },
              };
            } else if (sprite.id === spriteB.id) {
              return {
                ...sprite,
                id: spriteA.id,
                position: { x: newX2, y: newY2 },
              };
            }
            return sprite; // Return unchanged sprite
          });

          setSprites(newSprites);
        }
      }
    }
  };



  useEffect(() => {
    if(collision){
      swapSpritesIfClose(sprites);
    }
}, [sprites,collision]);


  return (
    <Getcontext.Provider
      value={{
        spriteCount,
        setSpriteCount,
        curSprite,
        setCurSprite,
        sprites,
        setSprites,
        midArrays,
        insertIntoMidArray, // Provide function to insert
        deleteFromMidArray, // Provide function to delete
        stepInXValues, // Provide stepInX values
        setStepInX, // Provide function to set or update stepInX
        stepInYValues, // Provide stepInY values
        setStepInY, // Provide function to set or update stepInY
        updateSpriteXPosition, // Provide function to update sprite x position
        updateSpriteYPosition, // Provide function to update sprite y position
        setRotationRight, // Provide the set rotation right function
        rotationInRight, // Provide the object for right rotation values
        updateSpriteRightRotation, // Provide function to update sprite right rotation
        updateSpriteLeftRotation, // Provide the left rotation update function
        setRotationLeft, // Provide the set rotation left function
        rotationInLeft, // Provide the object for left rotation values
        Repeat, // Provide the repeat state
        setRepeatValue, // Provide the function to set repeat values
        getCurrentSpriteValues, // Provide function to get current sprite's x, y, and rotation
        updatepreview,
        setupdatepreview,
        setupdatepreviewvalue,
        gotoValues, // Provide Goto values
        setGoto, // Provide function to set Goto values
        getGotoValues, // Provide function to get Goto values
        moveComponent,
        handleRunForAllSprites,
        swapSpritesIfClose,
        collision,
        setCollision,
      }}
    >
      {props.children}
    </Getcontext.Provider>
  );
}

export default Allcontext;

import React, { useContext, useState, useRef, useEffect } from "react";
import Getcontext from "../context/Getcontext";

const SpriteImage = React.memo(({ sprite, onDragStart, onDragEnd }) => {
  return (
    <img
      key={sprite.id}
      src={sprite.src}
      alt={`Sprite ${sprite.id}`}
      className="cursor-pointer transition-all duration-1000"
      draggable
      onDragStart={(e) => onDragStart(e, sprite)}
      onDragEnd={onDragEnd}
      style={{
        position: "absolute",
        width: "100px",
        height: "100px",
        left: `${sprite.position.x}px`,
        top: `${sprite.position.y}px`,
        transform: `rotate(${isNaN(sprite.angle) ? 0 : sprite.angle}deg)`,
      }}
    />
  );
});

function PreviewArea() {
  const {
    spriteCount,
    setSpriteCount,
    curSprite,
    setCurSprite,
    sprites,
    setSprites,
    updatepreview,
    handleRunForAllSprites,
  } = useContext(Getcontext);

  const [activeImg, setActiveImg] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const [clickedButton, setClickedButton] = useState(null); // New state for clicked button

  // Array of SVG image URLs
  const imageOptions = [
    "https://en.scratch-wiki.info/w/images/ScratchCat3.0.svg",
    "https://res.cloudinary.com/dhvhrfj3i/image/upload/v1728147841/Indiramail/chasing-waves-svgrepo-com_obhayc.svg",
    "https://res.cloudinary.com/dhvhrfj3i/image/upload/v1728147851/Indiramail/dog-svgrepo-com_lwsayb.svg",
    "https://res.cloudinary.com/dhvhrfj3i/image/upload/v1728147863/Indiramail/pig-svgrepo-com_qxq9rt.svg",
  ];

  // State to store the selected image URL
  const [selectedImage, setSelectedImage] = useState(imageOptions[0]);

  const addSprite = () => {
    const newSprite = {
      id: `draggable-${sprites.length + 1}`,
      src: selectedImage,
      position: { x: 10, y: (sprites.length + 1) * 110 },
      angle: 0,
    };

    setSprites((prevSprites) => [...prevSprites, newSprite]);
    setSpriteCount((prevCount) => prevCount + 1);
    setCurSprite(newSprite.id);
    setClickedButton("addSprite"); // Set clicked button
    setTimeout(() => setClickedButton(null), 300); // Reset after animation
  };

  const removeSprite = () => {
    if (curSprite) {
      const updatedSprites = sprites.filter(
        (sprite) => sprite.id !== curSprite
      );
      setSprites(updatedSprites);
      setCurSprite(updatedSprites.length > 0 ? updatedSprites[0].id : null);
      setClickedButton("removeSprite"); // Set clicked button
      setTimeout(() => setClickedButton(null), 300); // Reset after animation
    }
  };

  const handleSelectChange = (e) => {
    setCurSprite(e.target.value);
  };

  const handleDragStart = (e, sprite) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    setActiveImg(sprite);

    const previewRect = previewRef.current.getBoundingClientRect();
    const offsetX = e.clientX - previewRect.left - sprite.position.x;
    const offsetY = e.clientY - previewRect.top - sprite.position.y;

    setOffset({ x: offsetX, y: offsetY });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    if (activeImg) {
      const previewRect = previewRef.current.getBoundingClientRect();
      const newX = e.clientX - previewRect.left - offset.x;
      const newY = e.clientY - previewRect.top - offset.y;

      const boundedX = Math.max(0, Math.min(newX, previewRect.width - 100));
      const boundedY = Math.max(0, Math.min(newY, previewRect.height - 100));

      const updatedSprites = sprites.map((sprite) => {
        if (sprite.id === activeImg.id) {
          return {
            ...sprite,
            position: { x: boundedX, y: boundedY },
          };
        }
        return sprite;
      });

      setSprites(updatedSprites);
    }
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    if (activeImg) {
      setActiveImg(null);
    }
  };

  useEffect(() => {
    console.log("Sprites updated:", sprites);
  }, [sprites, updatepreview]);

  return (
    <div
      ref={previewRef}
      className="w-[40%] min-h-[100vh] overflow-auto bg-white rounded-lg py-4 px-3 relative text-black border-[2px] border-black"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragEnd}
      onDrag={handleDrag}
    >
      <div className="text-2xl text-black mb-3">Preview Area</div>
      <button
        onClick={addSprite}
        className={`mb-2 mr-3 p-2 bg-blue-500 text-white rounded transition-transform duration-300 ${
          clickedButton === "addSprite" ? "scale-95" : ""
        }`}
      >
        Add Sprite
      </button>
      <button
        className={`bg-yellow-400 mr-2 w-[8vw] py-2 rounded-md transition-transform duration-300 ${
          clickedButton === "runAllSprites" ? "scale-95" : ""
        }`}
        onClick={() => {
          handleRunForAllSprites();
          setClickedButton("runAllSprites");
          setTimeout(() => setClickedButton(null), 300); // Reset after animation
        }}
      >
        Run all sprites
      </button>
      <button
        onClick={removeSprite}
        className={`mb-2 p-2 mr-3 bg-red-500 text-white rounded transition-transform duration-300 ${
          clickedButton === "removeSprite" ? "scale-95" : ""
        }`}
        disabled={!curSprite}
      >
        Remove Current Sprite
      </button>
      <select
        value={curSprite || ""}
        onChange={handleSelectChange}
        className="mb-2 p-2 border border-gray-800 rounded-md"
      >
        <option value="" disabled>
          Select a sprite
        </option>
        {sprites.map((sprite, index) => (
          <option key={sprite.id} value={sprite.id}>
            Sprite {index + 1}
          </option>
        ))}
      </select>

      <select
        value={selectedImage}
        onChange={(e) => setSelectedImage(e.target.value)}
        className="mb-2 p-2 border border-gray-800 rounded-md"
      >
        {imageOptions.map((img, index) => (
          <option key={index} value={img}>
            Sprite Image {index + 1}
          </option>
        ))}
      </select>

      <div className="relative">
        {sprites.map((sprite) => (
          <SpriteImage
            key={sprite.id}
            sprite={sprite}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default PreviewArea;

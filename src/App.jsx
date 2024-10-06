import React, { createContext, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './components/Sidebar';
import Midarea from './components/Midarea';
import Allcontext from './context/Allcontext';
import PreviewArea from './components/PreviewArea';
import Getcontext from './context/Getcontext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { curSprite } = useContext(Getcontext);

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="h-full w-full text-white flex">
          <Sidebar id={curSprite} />
          <Midarea id={curSprite} />
          <PreviewArea />
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;

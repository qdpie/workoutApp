// GeneratedExercisesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GeneratedExercisesContextType {
  exercises: any[]; // Consider specifying a more precise type instead of any[] if possible.
  setExercises: React.Dispatch<React.SetStateAction<any[]>>;
}

const defaultState: GeneratedExercisesContextType = {
  exercises: [],
  setExercises: () => {},
};

const GeneratedExercisesContext = createContext<GeneratedExercisesContextType>(defaultState);

export const useGeneratedExercises = () => useContext(GeneratedExercisesContext);

export const GeneratedExercisesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [exercises, setExercises] = useState<any[]>([]);

  return (
    <GeneratedExercisesContext.Provider value={{ exercises, setExercises }}>
      {children}
    </GeneratedExercisesContext.Provider>
  );
};
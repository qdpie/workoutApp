// FetchExercisesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface FetchExercisesContextType {
  shouldFetch: boolean;
  setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultState: FetchExercisesContextType = {
  shouldFetch: false,
  setShouldFetch: () => {},
};

const FetchExercisesContext =
  createContext<FetchExercisesContextType>(defaultState);

export const useFetchExercises = () => useContext(FetchExercisesContext);

export const FetchExercisesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  return (
    <FetchExercisesContext.Provider value={{ shouldFetch, setShouldFetch }}>
      {children}
    </FetchExercisesContext.Provider>
  );
};

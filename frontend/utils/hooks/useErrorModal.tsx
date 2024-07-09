// useErrorModal.ts
import { useState } from "react";

const useErrorModal = () => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorVisible(true);
  };

  const closeError = () => {
    setErrorVisible(false);
  };

  return { errorVisible, errorMessage, showError, closeError };
};

export default useErrorModal;

// Hook personnalisé pour gérer l'état de chargement dans toute l'application

import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message: string;
  progress?: number;
}

export function useLoading(initialMessage: string = "Chargement...") {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: initialMessage,
    progress: undefined
  });

  /**
   * Démarre le chargement avec un message optionnel
   */
  const startLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      message: message || initialMessage,
      progress: undefined
    });
  }, [initialMessage]);

  /**
   * Arrête le chargement
   */
  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: initialMessage,
      progress: undefined
    });
  }, [initialMessage]);

  /**
   * Met à jour le message de chargement
   */
  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  }, []);

  /**
   * Met à jour la progression (0-100)
   */
  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress))
    }));
  }, []);

  return {
    ...loadingState,
    startLoading,
    stopLoading,
    updateMessage,
    updateProgress
  };
}

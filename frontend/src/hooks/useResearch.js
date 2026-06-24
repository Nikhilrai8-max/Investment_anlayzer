import { useMutation } from '@tanstack/react-query';
import { analyzeCompany } from '../services/api.js';

export function useResearch(onSuccess, onError) {
  return useMutation({
    mutationFn: (company) => analyzeCompany(company),
    onSuccess,
    onError,
    retry: false
  });
}

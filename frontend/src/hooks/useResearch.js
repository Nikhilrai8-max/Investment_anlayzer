import { useMutation } from '@tanstack/react-query';
import { analyzeCompany } from '../services/api.js';

export function useResearch(onSuccess, onError) {
  return useMutation((company) => analyzeCompany(company), {
    onSuccess,
    onError,
    retry: false
  });
}

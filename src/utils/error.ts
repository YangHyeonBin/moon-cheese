import { isAxiosError } from 'axios';

export const isServerError = (error: Error): boolean => {
  return isAxiosError(error) && (error.response?.status ?? 0) >= 500;
};

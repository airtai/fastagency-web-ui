// services/modelService.ts
import { getModels as apiGetModels } from 'wasp/client/operations';

export const getModels = async () => {
  try {
    const response = await apiGetModels();
    return response;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw error;
  }
};

import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { PurchaseRequestForm } from './entities';
import { useCreatePurchaseRequest } from './hook';

export const usePurchaseRequestHelpers = () => {
  const mutationCreatePurchaseRequest = useCreatePurchaseRequest();
  const handleCreatePurchaseRequest = (data: PurchaseRequestForm) => {
    return new Promise((resolve, reject) => {
      mutationCreatePurchaseRequest.mutate(data, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data created!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to create data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  return {
    mutationCreatePurchaseRequest,
    handleCreatePurchaseRequest,
  };
};

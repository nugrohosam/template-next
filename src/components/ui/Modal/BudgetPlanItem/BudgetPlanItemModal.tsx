import { Currency } from 'constants/currency';
import { BudgetPlanItemOfBudgetPlanItemForm } from 'modules/budgetPlanItem/entities';
import React from 'react';

import IsBuildingModal from './IsBuildingModal';
import NonBuildingModal from './NonBuildingModal';

export interface BudgetPlanItemModalProps {
  onSend: (data: BudgetPlanItemOfBudgetPlanItemForm) => void;
  classButton?: string;
  isEdit?: boolean;
  inPageUpdate?: { idAssetGroup: string; currency: Currency | null };
  isBuilding?: boolean;
  myItem?: BudgetPlanItemOfBudgetPlanItemForm;
  buttonTitle?: string;
}

const BudgetPlanItemModal: React.FC<BudgetPlanItemModalProps> = ({
  onSend,
  classButton,
  isEdit = false,
  inPageUpdate,
  isBuilding = false,
  myItem,
  buttonTitle = '+ Add Item',
}) => {
  const props = {
    onSend,
    classButton,
    isEdit,
    inPageUpdate,
    myItem,
    isBuilding,
    buttonTitle,
  };

  return (
    <>
      <></>
      {isBuilding ? (
        <IsBuildingModal {...props}></IsBuildingModal>
      ) : (
        <NonBuildingModal {...props}></NonBuildingModal>
      )}
    </>
  );
};

export default BudgetPlanItemModal;

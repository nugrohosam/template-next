import { Currency } from 'constants/currency';
import { ItemOfBudgetPlanItemForm } from 'modules/budgetPlanItem/entities';
import React from 'react';

import IsBuildingModal from './IsBuildingModal';
import NonBuildingModal from './NonBuildingModal';

interface BudgetPlanItemModalProps {
  onSend: (data: ItemOfBudgetPlanItemForm) => void;
  classButton?: string;
  isEdit?: boolean;
  inPageUpdate?: { idAssetGroup: string; currency: Currency | null };
  isBuilding?: boolean;
  myItem?: ItemOfBudgetPlanItemForm;
  buttonTitle?: string;
}

const IsBuildingBudgetPlanItemModal: React.FC<BudgetPlanItemModalProps> = ({
  onSend,
  classButton,
  isEdit = false,
  inPageUpdate,
  isBuilding = false,
  myItem,
  buttonTitle,
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

export default IsBuildingBudgetPlanItemModal;

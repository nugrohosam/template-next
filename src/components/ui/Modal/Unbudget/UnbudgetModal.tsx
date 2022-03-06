import { Currency } from 'constants/currency';
import { PeriodeType } from 'constants/period';
import { ItemOfBudgetPlanItemForm } from 'modules/budgetPlanItem/entities';
import React from 'react';

// import IsBuildingModal from './IsBuildingModal';
import NonBuildingModal from './NonBuildingModal';

export interface UnbudgetModalProps {
  onSend: (data: ItemOfBudgetPlanItemForm) => void;
  classButton?: string;
  isEdit?: boolean;
  inPageUpdate?: { idAssetGroup: string; currency: Currency | null };
  isBuilding?: boolean;
  myItem?: ItemOfBudgetPlanItemForm;
  buttonTitle?: string;
  period: PeriodeType;
}

const UnbudgetModal: React.FC<UnbudgetModalProps> = ({
  onSend,
  classButton,
  isEdit = false,
  inPageUpdate,
  isBuilding = false,
  myItem,
  buttonTitle = '+ Add Item',
  period,
}) => {
  const props = {
    onSend,
    classButton,
    isEdit,
    inPageUpdate,
    myItem,
    isBuilding,
    buttonTitle,
    period,
  };

  return (
    <>
      <></>
      {isBuilding ? (
        // <IsBuildingModal {...props}></IsBuildingModal>
        <div></div>
      ) : (
        <NonBuildingModal {...props}></NonBuildingModal>
      )}
    </>
  );
};

export default UnbudgetModal;

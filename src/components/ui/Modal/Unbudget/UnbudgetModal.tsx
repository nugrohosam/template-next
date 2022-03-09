import { Currency } from 'constants/currency';
import { PeriodeType } from 'constants/period';
import { BudgetPlanItemOfUnbudgetForm } from 'modules/unbudget/entities';
import React from 'react';

import IsBuildingModal from './IsBuildingModal';
import NonBuildingModal from './NonBuildingModal';

export interface UnbudgetModalProps {
  onSend: (data: BudgetPlanItemOfUnbudgetForm) => void;
  classButton?: string;
  isEdit?: boolean;
  inPageUpdate?: { idAssetGroup: string; currency: Currency | null };
  isBuilding?: boolean;
  myItem?: BudgetPlanItemOfUnbudgetForm;
  buttonTitle?: string;
  period: PeriodeType | string | undefined;
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
        <IsBuildingModal {...props}></IsBuildingModal>
      ) : (
        <NonBuildingModal {...props}></NonBuildingModal>
      )}
    </>
  );
};

export default UnbudgetModal;

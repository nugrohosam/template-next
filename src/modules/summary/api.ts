import { PeriodeType } from 'constants/period';
import { CurrentBudgetPlanParams } from 'modules/budgetPlan/api';
import { CurrentBudgetPlan } from 'modules/budgetPlan/entities';
import { ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { AssetGroupSummary, InterveneField } from './entities';

export interface FetchSummaryByAssetGroupParams {
  year: number;
  period: PeriodeType;
  districts: string;
}

export const fetchAssetGroupSummary = async (
  idAssetGroup: string,
  params: FetchSummaryByAssetGroupParams
): Promise<AssetGroupSummary> => {
  const result = await axios.get<ResponseData<AssetGroupSummary>>(
    `v1/summaries/${idAssetGroup}`,
    { params }
  );
  return result.data.data;
};

export const interveneSummaryAssetGroup = async (
  idAssetGroup: string,
  data: InterveneField
): Promise<InterveneField> => {
  const result = await axios.post<ResponseData<InterveneField>>(
    `v1/summaries/${idAssetGroup}/intervene`,
    data
  );
  return result.data.data;
};

export const fetchActiveBudgetPlan = async (
  params: CurrentBudgetPlanParams
): Promise<CurrentBudgetPlan> => {
  const result = await axios.get<ResponseData<CurrentBudgetPlan>>(
    `v1/budgetplan/active`,
    { params }
  );
  return result.data.data;
};

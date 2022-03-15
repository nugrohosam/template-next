import { CurrentBudgetPlanParams } from 'modules/budgetPlan/api';
import { CurrentBudgetPlan } from 'modules/budgetPlan/entities';
import { ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  fetchActiveBudgetPlan,
  fetchAssetGroupSummary,
  FetchSummaryByAssetGroupParams,
  interveneSummaryAssetGroup,
} from './api';
import { AssetGroupSummary, InterveneField } from './entities';

export const useFetchAssetGroupSummary = (
  idAssetGroup: string,
  params: FetchSummaryByAssetGroupParams
): UseQueryResult<AssetGroupSummary, ResponseError> => {
  return useQuery(
    ['asset-group-summary', idAssetGroup, params],
    () => fetchAssetGroupSummary(idAssetGroup, params),
    { enabled: !!idAssetGroup }
  );
};

interface InterveneAssetGroupParams {
  idAssetGroup: string;
  data: InterveneField;
}

export const useInterveneSummaryAssetGroup = (): UseMutationResult<
  InterveneField,
  ResponseError,
  InterveneAssetGroupParams
> => {
  return useMutation(({ idAssetGroup, data }) =>
    interveneSummaryAssetGroup(idAssetGroup, data)
  );
};

export const useFetchActiveBudgetPlan = (
  params: CurrentBudgetPlanParams
): UseQueryResult<CurrentBudgetPlan> => {
  return useQuery(['active-budget-plan', params], () =>
    fetchActiveBudgetPlan(params)
  );
};

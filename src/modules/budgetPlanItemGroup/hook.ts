import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  approvalBudgetPlanItemGroups,
  BudgetPlanItemGroupsParams,
  BuildingAttachmentParams,
  deleteBudgetPlanItemGroups,
  fetchBudgetPlanItemGroupDetail,
  fetchBudgetPlanItemGroupItems,
  fetchBudgetPlanItemGroups,
  fetchBuildingAttachments,
  submitBudgetPlanItemGroups,
} from './api';
import {
  ApprovalBudgetPlanItemGroup,
  BudgetPlanItemGroup,
  BudgetPlanItemGroupItem,
  BuildingAttachment,
} from './entities';

export const useFetchBudgetPlanItemGroups = (
  params: BudgetPlanItemGroupsParams
): UseQueryResult<Paginate<BudgetPlanItemGroup>, ResponseError> => {
  return useQuery(['budget-plan-item-groups', params], () =>
    fetchBudgetPlanItemGroups(params)
  );
};

export const useFetchBudgetPlanItemGroupDetail = (
  idBudgetPlanItemGroup: string
): UseQueryResult<BudgetPlanItemGroup> => {
  return useQuery(
    ['budget-plan-item-group-detail', idBudgetPlanItemGroup],
    () => fetchBudgetPlanItemGroupDetail(idBudgetPlanItemGroup),
    { enabled: !!idBudgetPlanItemGroup }
  );
};

export const useFetchBudgetPlanItemGroupItems = (
  idBudgetPlanItemGroup: string,
  params?: PaginateParams
): UseQueryResult<Paginate<BudgetPlanItemGroupItem>, ResponseError> => {
  return useQuery(
    ['budget-plan-item-group-items', idBudgetPlanItemGroup, params],
    () => fetchBudgetPlanItemGroupItems(idBudgetPlanItemGroup, params),
    { enabled: !!idBudgetPlanItemGroup }
  );
};

export const useDeleteBudgetPlanItemGroups = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlanItemGroups) =>
    deleteBudgetPlanItemGroups(idBudgetPlanItemGroups)
  );
};

export const useSubmitBudgetPlanItemGroups = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlanItemGroups) =>
    submitBudgetPlanItemGroups(idBudgetPlanItemGroups)
  );
};

export const useApprovalBudgetPlanItemGroups = (): UseMutationResult<
  null,
  ResponseError,
  ApprovalBudgetPlanItemGroup
> => {
  return useMutation((data) => approvalBudgetPlanItemGroups(data));
};

export const useFetchBuildingAttachments = (
  idBudgetPlanItemGroup: string,
  params: BuildingAttachmentParams,
  isBuilding: boolean
): UseQueryResult<Paginate<BuildingAttachment>, ResponseError> => {
  return useQuery(
    ['building-attachments', params],
    () => fetchBuildingAttachments(idBudgetPlanItemGroup, params),
    {
      enabled: isBuilding && !!idBudgetPlanItemGroup,
    }
  );
};

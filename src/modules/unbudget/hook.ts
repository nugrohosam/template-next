import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation, // for another usage
  UseMutationResult, // for another usage
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  fetch
} from './api';

import {
  SomeObject,
} from './entities';

export const useFetchUnbudgets = (
  params: PaginateParams
): UseQueryResult<Paginate<SomeObject>, ResponseError> => {
  return useQuery(['unbudgets', params], () => fetch(params));
};

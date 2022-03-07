import { SelectOption } from 'components/form/SingleSelect';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import { useEffect, useMemo, useState } from 'react';

export const useBudgetCodeOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const budgetReferencesHook = useFetchBudgetReferences({
    pageNumber: 1,
    pageSize: 50,
  });

  const budgetCodeOptions = useMemo<SelectOption[]>(
    () =>
      budgetReferencesHook.data?.items.map((item) => ({
        value: item.id,
        label: item.budgetCode,
      })) || [],
    [budgetReferencesHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(budgetCodeOptions);
  }, [budgetCodeOptions]);

  return [selectOptions];
};

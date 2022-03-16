import { SelectOption } from 'components/form/SingleSelect';
import { useFetchDeliveryPoints } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useDeliveryPointOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchDeliveryPoints({
    pageNumber: 1,
    pageSize: 50,
  });

  const deliveryPointOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.deliveryPointId,
        label: item.description,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(deliveryPointOptions);
  }, [deliveryPointOptions]);

  return [selectOptions];
};

import { Form } from 'react-bootstrap';
import {
  Control,
  Controller,
  FieldPath,
  FieldPathValue,
  UnpackNestedValue,
  UseControllerProps,
} from 'react-hook-form';
import AsyncSelect from 'react-select/async';

import { customStyles } from './SingleSelect';

export interface SelectOption {
  value: string | number | boolean;
  label: string;
}

interface Props<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  options: SelectOption[];
  loadOptions: (inputValue: string) => void;
  placeholder: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isOptionCache?: boolean;
  isOptionDefault?: boolean | SelectOption[];
  error?: string;
}

function SelectAsync<T>({
  name,
  control,
  options,
  loadOptions,
  placeholder,
  defaultValue,
  isMulti = false,
  isClearable = false,
  isSearchable = true,
  isOptionCache = false,
  isOptionDefault = false,
  error,
}: Props<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <AsyncSelect
            {...field}
            instanceId={name}
            isMulti={isMulti}
            isClearable={isClearable}
            isSearchable={isSearchable}
            cacheOptions={isOptionCache}
            defaultOptions={isOptionDefault}
            loadOptions={loadOptions}
            placeholder={placeholder}
            styles={customStyles(error)}
            value={options.find((x) => x.value === field.value)}
            onChange={(val) => field.onChange((val as SelectOption).value)}
          />
        )}
      ></Controller>
      <Form.Control.Feedback
        type="invalid"
        className={!!error ? 'd-block' : ''}
      >
        {error}
      </Form.Control.Feedback>
    </>
  );
}

export default SelectAsync;

import { Form } from 'react-bootstrap';
import {
  Control,
  Controller,
  FieldPath,
  FieldPathValue,
  UnpackNestedValue,
  UseControllerProps,
} from 'react-hook-form';
import Select from 'react-select';

export interface SelectOption {
  value: string | number | boolean;
  label: string;
}

interface Props<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  options: SelectOption[];
  placeholder: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  error?: string;
  onChange?: (val: SelectOption) => void;
}

export const customStyles = (error: string = '') => {
  return {
    control: (provided: any) => ({
      ...provided,
      borderRadius: 0,
      border: !!error ? '1px solid #DC3545' : '1px solid #ACBADF',
      boxShadow: 'none',
      color: '#253B78',
      padding: 2,
      fontSize: '12px',
      height: 'auto',
      minHeight: 'auto',
      '&:hover': {
        border: !!error ? '1px solid #DC3545' : '1px solid #253B78',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: 0,
      zIndex: 1001,
    }),
    option: (provided: any) => ({
      ...provided,
      fontSize: '12px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#253B78',
      fontWeight: '500',
    }),
  };
};

function SingleSelect<T>({
  name,
  control,
  options,
  placeholder,
  defaultValue,
  isMulti = false,
  isClearable = false,
  isSearchable = true,
  isDisabled = false,
  error,
  onChange,
}: Props<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            {...field}
            instanceId={name}
            isMulti={isMulti}
            isClearable={isClearable}
            isSearchable={isSearchable}
            isDisabled={isDisabled}
            placeholder={placeholder}
            options={options}
            styles={customStyles(error)}
            value={options.find((x) => x.value === field.value) || null}
            onChange={(val) => {
              field.onChange((val as SelectOption).value);
              if (onChange) {
                onChange(val as SelectOption);
              }
            }}
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

export default SingleSelect;

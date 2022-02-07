import { Form, FormControl } from 'react-bootstrap';
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  FieldPath,
  FieldPathValue,
  UnpackNestedValue,
  UseControllerProps,
} from 'react-hook-form';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface PropsSelect<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  error?: string;
}

function Select<T>({
  name,
  control,
  options,
  placeholder,
  defaultValue,
  error,
}: PropsSelect<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControl
            as="select"
            placeholder={placeholder}
            isInvalid={!!error}
            {...field}
          >
            <option value="">Select {name}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormControl>
        )}
      ></Controller>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </>
  );
}

export default Select;

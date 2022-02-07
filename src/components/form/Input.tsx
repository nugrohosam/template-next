import { ElementType, useState } from 'react';
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

interface PropsInput<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  type?: string;
  placeholder?: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  error?: string;
  disabled?: boolean;
  as?: ElementType<any>;
  min?: string | null;
  max?: string | null;
}

function Input<T>({
  name,
  control,
  type,
  placeholder,
  defaultValue,
  error,
  disabled,
  min,
  max,
  as = 'input',
}: PropsInput<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControl
            type={type}
            as={as}
            placeholder={placeholder}
            isInvalid={!!error}
            disabled={disabled}
            min={min}
            max={max}
            {...field}
          />
        )}
      ></Controller>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </>
  );
}

export default Input;

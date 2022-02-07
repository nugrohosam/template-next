import { ElementType, forwardRef, HTMLProps, RefObject, useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
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

interface PropsDatepicker<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  placeholder?: string;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  error?: string;
  disabled?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  showDisabledMonthNavigation?: boolean;
}

type InputProps = HTMLProps<HTMLInputElement>;

function Datepicker<T>({
  name,
  control,
  placeholder,
  defaultValue,
  error,
  disabled,
  minDate,
  maxDate,
  showDisabledMonthNavigation = false,
}: PropsDatepicker<T>) {
  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef<HTMLInputElement, InputProps>(
    ({ value, onClick }, ref) => (
      <Form.Control
        onClick={onClick}
        ref={ref}
        type="text"
        placeholder={placeholder}
        isValid={!!error}
      />
    )
  );

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <DatePicker
            customInput={<CustomInput />}
            selected={field.value as Date}
            onChange={(date) => field.onChange(date)}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            showDisabledMonthNavigation={showDisabledMonthNavigation}
          />
        )}
      ></Controller>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </>
  );
}

export default Datepicker;

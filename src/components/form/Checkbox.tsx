import { Form } from 'react-bootstrap';
import {
  Control,
  Controller,
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
  label?: string;
}

function Input<T>({
  name,
  control,
  placeholder,
  defaultValue,
  error,
  disabled,
  label,
}: PropsInput<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, ...rest } }) => (
          <div className="custom-control custom-checkbox">
            <input
              id={name}
              type="checkbox"
              className="custom-control-input"
              placeholder={placeholder}
              disabled={disabled}
              {...rest}
            />
            <label className="custom-control-label" htmlFor={name}>
              {label}
            </label>
          </div>
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

export default Input;
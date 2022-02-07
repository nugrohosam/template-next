import React, { useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import {
  Control,
  Controller,
  FieldPath,
  UseControllerProps,
} from 'react-hook-form';

interface FileInputProps<T> extends UseControllerProps<T, FieldPath<T>> {
  name: FieldPath<T>;
  control: Control<T, object>;
  placeholder: string;
  error?: string;
  multiple?: boolean;
}

function FileInput<T>({
  name,
  control,
  placeholder,
  error,
  multiple = false,
}: FileInputProps<T>) {
  const [fileName, setFileName] = useState<string>('');
  const [label, setLabel] = useState<string>(placeholder);
  const onChangeFile = (value: string) => {
    setFileName(value);
    setLabel(value);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <FormGroup className="input-group form-group--icon mb-0">
            <Form.File
              label={label}
              value={fileName}
              isInvalid={!!error}
              className="file-input"
              type="file"
              multiple={multiple}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChangeFile(e.target.value);
                onChange((e.target as HTMLInputElement).files);
              }}
              {...rest}
              custom
              inputAs="input"
            />
            <div className="input-group-append">
              <span className="input-group-text">
                <div className="ic_attach"></div>
              </span>
            </div>
          </FormGroup>
        )}
      ></Controller>
      <Form.Control.Feedback type="invalid" className="d-block">
        {error}
      </Form.Control.Feedback>
    </>
  );
}

export default FileInput;

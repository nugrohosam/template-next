import React, { forwardRef, MutableRefObject, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

interface CheckboxProps {
  indeterminate?: boolean;
}

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef<HTMLInputElement, any>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      (resolvedRef as MutableRefObject<any>).current.indeterminate =
        indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          ref={resolvedRef}
          {...rest}
        />
        <label className="custom-control-label"></label>
      </div>
    );
  }
);

export default IndeterminateCheckbox;

// TODO : Backup Previous Checkbox Just In Case

import React, { forwardRef, MutableRefObject, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

interface CheckboxProps {
  indeterminate?: boolean;
}

const useCombinedRefs = (...refs: Array<any>): MutableRefObject<any> => {
  const targetRef = useRef(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, ...rest }, ref: React.Ref<HTMLInputElement>) => {
    const defaultRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, defaultRef);

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [combinedRef, indeterminate]);

    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          ref={combinedRef}
          {...rest}
        />
        <label className="custom-control-label"></label>
      </div>
    );
  }
);

export default IndeterminateCheckbox;

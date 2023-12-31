import React from 'react';
import { useWatch } from 'react-hook-form';

const DisplayColorCode = ({ control,defVal }: any) => {
  const color = useWatch({
    control,
    name: 'color',
    defaultValue: defVal, // default value before the render
  });
  return (
    <>
      {color !== null && (
        <span className="ms-3 px-2 py-1 text-sm text-heading bg-gray-100 border border-border-200 rounded">
          {color}
        </span>
      )}
    </>
  );
};

export default DisplayColorCode;

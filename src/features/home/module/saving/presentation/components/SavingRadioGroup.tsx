import { uuid4 } from '@sentry/core';
import React, { ReactElement, useState } from 'react';
import { ISavingWallet } from '../../types';

type SavingRadioProps = {
  value: ISavingWallet;
  label: string;
  name?: string;
  checked?: boolean;
  onChange?: (value: ISavingWallet) => void;
  classNames?: string;
};

export function SavingRadioItem({
  value,
  label,
  name,
  checked = false,
  onChange,
  classNames,
}: SavingRadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg shadow">
      <input
        type="radio"
        name={name}
        value={value.id}
        checked={checked}
        className="cursor-pointer"
        onChange={() => onChange?.(value)}
      />
      <span className={classNames}>{label}</span>
    </label>
  );
}

type ChildProps = {
  children: ReactElement<SavingRadioProps> | ReactElement<SavingRadioProps>[];
  defaultValue: ISavingWallet | null;
  getResultValue: (value: ISavingWallet) => void;
  classNames?: string;
};

export function SavingRadioGroup({
  children,
  defaultValue,
  getResultValue,
  classNames,
}: ChildProps) {
  const name = uuid4(); //unique for this group
  const [selected, setSelected] = useState<ISavingWallet | null>(defaultValue);

  const handleChange = (value: ISavingWallet) => {
    setSelected(value);
    getResultValue(value);
  };

  return (
    <div className={`w-fit flex gap-2 mt-2 ${classNames}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              name,
              checked: child.props.value.id === selected?.id,
              onChange: handleChange,
            })
          : child,
      )}
    </div>
  );
}

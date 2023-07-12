import { MouseEvent, FC } from 'react';
import { classNames } from './classNames';
import { Resizable } from 're-resizable';
type Props = {
  id?: string;
  selected?: boolean;
  name?: string;
  margin?: { left: number; right: number };
  size?: number;
  onClick?: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
};
export const Button: FC<Props> = ({
  id,
  name,
  selected,
  margin,
  size,
  onClick,
}) => {
  const flexShrink = calcFlexShrink(size);

  return (
    <Resizable
      defaultSize={{ width: 29.3, height: 40 }}
      className={classNames(selected && 'selected')}
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <button id={id} onClick={(e) => onClick?.(id as string, e)}>
        {name}
      </button>
    </Resizable>
  );
};

const calcFlexShrink = (size: number | undefined) => {
  const defaultValue = 1;
  if (!size) return defaultValue;

  const result = size / 10;

  return result > 1 || result < 0 ? defaultValue : result;
};

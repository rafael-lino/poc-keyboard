import { MouseEvent, FC } from 'react';
import { classNames } from './classNames';

type Props = {
  id?: string;
  selected?: boolean;
  name?: string;
  margin?: { left: number; right: number };
  size?: number;
  innerRef?: any;
  onClick?: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
};
export const Button: FC<Props> = ({
  id,
  name,
  selected,
  margin,
  size,
  innerRef,
  onClick,
  ...props
}) => {
  const flexShrink = calcFlexShrink(size);

  return (
    <button
      id={id}
      className={classNames(selected && 'selected')}
      style={{
        marginLeft: margin && `${margin.left}px`,
        marginRight: margin && `${margin.right}px`,
        flexShrink,
      }}
      onClick={(e) => onClick?.(id as string, e)}
      {...props}
      ref={innerRef}
    >
      {name}
    </button>
  );
};

const calcFlexShrink = (size: number | undefined) => {
  const defaultValue = 1;
  if (!size) return defaultValue;

  const result = size / 10;

  return result > 1 || result < 0 ? defaultValue : result;
};

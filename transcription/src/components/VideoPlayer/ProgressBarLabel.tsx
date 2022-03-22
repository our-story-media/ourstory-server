import { Tooltip, ValueLabelProps } from "@material-ui/core";

const ProgressBarLabel: React.FC<ValueLabelProps> = ({
  children,
  open,
  value,
}) => {
  return <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>{children}</Tooltip>;
};

export default ProgressBarLabel;

import { Typography, InputBase } from "@material-ui/core";
import React, { useState } from "react";
import IndabaButton from "../IndabaButton/IndabaButton";

type SimpleInputFormProps = {
  /** Placeholder for the Text Input */
  placeholder: string;
  /** Label for the submit button */
  buttonText: string;
  /** Class names for the text input */
  classes: { input: string; };
  /** Submit callback */
  onSubmit: (value: string) => void;
};

const SimpleInputForm: React.FC<SimpleInputFormProps> = React.forwardRef<HTMLDivElement, SimpleInputFormProps>(({
  placeholder,
  buttonText,
  classes,
  onSubmit,
}, ref) => {
  const [input, setInput] = useState<string | null>(null);
  return (
    <div ref={ref}>
      <InputBase
        className={classes.input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      <IndabaButton
        onClick={() => input && onSubmit(input)}
        styles={{  }}
      >
        <Typography >{buttonText}</Typography>
      </IndabaButton>
    </div>
  );
});

export default SimpleInputForm;

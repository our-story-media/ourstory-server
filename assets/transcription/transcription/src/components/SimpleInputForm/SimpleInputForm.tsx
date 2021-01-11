import { Box, Typography, InputBase } from "@material-ui/core";
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

const SimpleInputForm: React.FC<SimpleInputFormProps> = ({
  placeholder,
  buttonText,
  classes,
  onSubmit,
}) => {
  const [input, setInput] = useState<string | null>(null);
  return (
    <Box>
      <InputBase
        className={classes.input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      <IndabaButton
        onClick={() => input && onSubmit(input)}
        styles={{ height: "3rem" as const, borderRadius: "0px 8px 8px 0px" as const }}
      >
        <Typography variant="subtitle1">{buttonText}</Typography>
      </IndabaButton>
    </Box>
  );
};

export default SimpleInputForm;

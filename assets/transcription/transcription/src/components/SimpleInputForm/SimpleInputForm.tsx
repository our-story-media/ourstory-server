import { Box, Typography, InputBase, ButtonBase } from "@material-ui/core";
import React, { useState } from "react";

type SimpleInputFormProps = {
  /** Placeholder for the Text Input */
  placeholder: string;
  /** Label for the submit button */
  buttonText: string;
  /** Class names for the text input and button */
  classes: { input: string; button: string };
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
      <InputBase className={classes.input} onChange={e => setInput(e.target.value)} placeholder={placeholder} />
      <ButtonBase onClick={() => input && onSubmit(input)} className={classes.button}>
        <Typography variant="subtitle1">{buttonText}</Typography>
      </ButtonBase>
    </Box>
  );
};

export default SimpleInputForm;
import {
  Stepper,
  Step,
  StepLabel,
  Container,
  Button,
  Typography,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { ReactElement, useCallback } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import CentralModal from "../CentralModal/CentralModal";
import useStyles from "./OnboardingModalStyles";

type OnboardingModalProps = {
  show: boolean;
  dismiss: () => void;
  title: ReactElement;
  steps: string[];
  stepsLabels: string[];
  startButtonContent: ReactElement;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  show,
  dismiss,
  title,
  steps,
  stepsLabels,
  startButtonContent,
}) => {
  const { page, goTo, reset } = useSlideshow(steps);

  const dismissHandler = useCallback(() => {
    reset();
    dismiss();
  }, [dismiss, reset]);

  const nextPageHandler = useCallback(() => {
    page === steps.length - 1 ? dismissHandler() : goTo("next");
  }, [page, goTo, dismissHandler, steps.length]);

  const prevPageHandler = useCallback(() => {
    goTo("prev");
  }, [goTo]);

  const classes = useStyles();

  return (
    <CentralModal header={title} open={show} exit={dismissHandler}>
      <div className={classes.contentContainer}>
        <Stepper activeStep={page} alternativeLabel>
          {steps.map((_, idx) => (
            <Step key={idx}>
              <StepLabel
                StepIconProps={{
                  classes: {
                    active: classes.stepIcon,
                    text: classes.stepText,
                    completed: classes.stepCompleted,
                  },
                }}
              >
                {stepsLabels[idx]}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Container className={classes.instructionsContainer}>
          <div className={classes.centerVertically}>
            <Typography variant="h5">{steps[page]}</Typography>
          </div>
        </Container>
        <Container className={classes.buttonsContainer}>
          {page === 0 ? (
            <div />
          ) : (
            <Button
              onClick={prevPageHandler}
              variant="outlined"
              size="large"
              color="secondary"
            >
              <ChevronLeft /> Previous
            </Button>
          )}
          <Button
            onClick={nextPageHandler}
            variant="outlined"
            size="large"
            color="secondary"
          >
            {page === steps.length - 1 ? (
              startButtonContent
            ) : (
              <>
                Next <ChevronRight />
              </>
            )}
          </Button>
        </Container>
      </div>
    </CentralModal>
  );
};

export default OnboardingModal;

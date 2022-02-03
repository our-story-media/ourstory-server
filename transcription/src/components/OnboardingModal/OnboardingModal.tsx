import {
  Stepper,
  Step,
  StepLabel,
  Container,
  Divider,
  Typography,
  ButtonBase,
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
              <StepLabel>{stepsLabels[idx]}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Container className={classes.instructionsContainer}>
          <Divider className={classes.divider} />
          <div className={classes.centerVertically}>
            <Typography variant="h5">{steps[page]}</Typography>
          </div>
        </Container>
        <Container className={classes.buttonsContainer}>
          {page === 0 ? (
            <div />
          ) : (
            <ButtonBase onClick={prevPageHandler}>
              <ChevronLeft /> Previous
            </ButtonBase>
          )}
          <ButtonBase onClick={nextPageHandler}>
            {page === steps.length - 1 ? (
              startButtonContent
            ) : (
              <>
                Next <ChevronRight />
              </>
            )}
          </ButtonBase>
        </Container>
      </div>
    </CentralModal>
  );
};

export default OnboardingModal;

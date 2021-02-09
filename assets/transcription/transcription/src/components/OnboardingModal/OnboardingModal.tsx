import { Stepper, Step, StepLabel, Container, Divider, Typography, ButtonBase } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { ReactElement, useCallback } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import CentralModal from "../CentralModal/CentralModal";

type OnboardingModalProps = {
  show: boolean;
  dismiss: () => void;
  title: ReactElement;
  steps: string[];
  startButtonContent: ReactElement;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ show, dismiss, title, steps, startButtonContent }) => {

  const {page, goTo} = useSlideshow(steps);

const nextPageHandler = useCallback(() => {
    page === steps.length - 1 ? dismiss() : goTo("next");
  }, [page, goTo, dismiss, steps.length]);

  const prevPageHandler = useCallback(() => {
    goTo("prev");
  }, [goTo]);

  return (
    <CentralModal
      header={title}
      open={show}
      exit={dismiss}
    >
      <div
        style={{
          paddingBottom: "32px",
          height: "40vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stepper activeStep={page}>
          {steps.map((_, idx) => (
            <Step key={idx}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
        <Container style={{ flexGrow: 4 }}>
          <Divider style={{ marginBottom: "16px" }} />
          <div
            style={{
              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Typography variant="h5">{steps[page]}</Typography>
          </div>
        </Container>
        <Container style={{ display: "flex", justifyContent: "space-between" }}>
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

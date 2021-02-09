import {
  ButtonBase,
  Container,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import CentralModal from "../CentralModal/CentralModal";

type OnboardingModalProps = {
  show: boolean;
  dismiss: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ show, dismiss }) => {
  const steps = useRef([
    "You are about to chunk the video. The aim of chunking is to make Transcribing easy.",
    "To create a chunk, press the '+' button in the bottom right corner. The time that you press the '+' button in the video will be the end of the new chunk.",
    "You should aim to have only one person speaking in each chunk. Create a new chunk when there is a change in who is talking, there is a gap in the talking, or a person begins/ends talking.",
  ]);
  const { page, goTo } = useSlideshow(steps.current);

  const nextPageHandler = useCallback(() => {
    page === steps.current.length - 1 ? dismiss() : goTo("next");
  }, [page, goTo, dismiss]);

  const prevPageHandler = useCallback(() => {
    goTo("prev");
  }, [goTo]);

  return (
    <CentralModal
      header={<h2 style={{ margin: 0 }}>Chunking Instructions</h2>}
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
          {steps.current.map((_, idx) => (
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
            <Typography variant="subtitle1">{steps.current[page]}</Typography>
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
            {page === steps.current.length - 1 ? (
              "Start Chunking"
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

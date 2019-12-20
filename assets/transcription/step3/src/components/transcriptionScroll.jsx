import React, { Component } from "react";
import FreeScrollBar from "react-free-scrollbar";
import { Container, Row, Col, Card } from "react-bootstrap";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import axios from "axios";
import VideoPopup from "./videoPopup";
// import transcription from "../../src/example.json";

export default class TranscriptionScroll extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      original: {
        transcription: {
          chunks: []
        }
      },
      open: false,
      videoOpen: false,
      currentTarget: null,
      videoClip: {}
    };
  }

  componentDidMount() {
    this.serverRequest = axios.get("/api/watch/edit/" + this.props.id).then(
      function(result) {
        if (!result.data.transcription) {
          result.data.transcription = {
            chunks: []
          };
        }

        result.data.transcription.chunks.forEach(chunk => {
          chunk.contributions.forEach(contribution => {
            if (!contribution.annotations) contribution.annotations = [];
          })
        })

        this.setState({ original: result.data });
      }.bind(this)
    );
  }

  saveEdit() {
    axios
      .post(
        "/api/watch/savedit/" + this.props.id + "?apikey=" + this.props.apikey,
        this.state.original
      )
      .then(function(result) {
        console.log(result);
      });
  }

  handleVideoPlay = chunk => {
    // Play the current video chunk
    const starttime = chunk.starttime;
    const endtime = chunk.endtime;

    // Get the chunk index
    let { original } = this.state;
    let chunkIndex = original.transcription.chunks.findIndex(
      c => c.starttime === starttime
    );

    this.setState({
      videoOpen: true,
      videoClip: {
        index: ++chunkIndex,
        size: original.transcription.chunks.length,
        starttime: starttime,
        endtime: endtime
      }
    });
  };

  handleConfirm = (event, chunk) => {
    // Get the chunk clicked
    let { original } = this.state;
    let chunkIndex = original.transcription.chunks.findIndex(
      c => c.starttime === chunk.starttime
    );

    // Get the contributor selected
    let contributions = original.transcription.chunks[chunkIndex].contributions;
    let contributionIndex = contributions.findIndex(
      c => c.annotations.selected === true
    );

    // Update the text from the contributor selected
    let parentRow =
      event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    if (parentRow.className !== "row") parentRow = parentRow.parentNode;

    const contributionRow = parentRow.children[0].children[contributionIndex];

    // If no contribution row selected, inform the user to pick a contribution first
    if (!contributionRow) {
      console.log("Pick a contribution first...");
      return this.setState({ open: true, currentTarget: event.currentTarget });
    }

    original.transcription.chunks[chunkIndex].doneReview = true;

    // Otherwise, set the adopted contribution details with the new text retrieved
    const text = contributionRow.getElementsByTagName("input")[0].value;
    var adoptedContribution = { ...contributions[contributionIndex] };
    adoptedContribution.text = text;
    adoptedContribution.reviewedBy = this.props.reviewer;
    adoptedContribution.reviewedAt = new Date().toLocaleString("en-US");

    original.transcription.chunks[
      chunkIndex
    ].adoptedContribution = adoptedContribution;
    console.log(original.transcription);

    this.setState({ original });
    this.saveEdit();
  };

  handleTextClick = (chunk, contribution) => {
    // Get the chunk clicked
    let { original } = this.state;
    let chunkIndex = original.transcription.chunks.findIndex(
      c => c.starttime === chunk.starttime
    );
    // Modify the chunk to be attempted
    original.transcription.chunks[chunkIndex].attempted = true;

    // Get the contribution index
    let contributions = original.transcription.chunks[chunkIndex].contributions;
    let contributionIndex = contributions.indexOf(contribution);

    // Update the selected contributor
    contributions.forEach(contribution => {
      contribution.annotations.selected = false;
    });
    contributions[contributionIndex].annotations.selected = true;
    original.transcription.chunks[chunkIndex].contributions = contributions;

    // console.log("Chunk Index: ", chunkIndex);
    // console.log("Contribution Index: ", contributionIndex);
    // console.log("Contributions: ", contributions);

    // Update the state
    this.setState({ original });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleVideoClose = () => {
    this.setState({ videoOpen: false });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Video Transcription Review</h1>
        <br />

        <div style={{ width: "100%", height: "90vh" }}>
          <FreeScrollBar>
            {this.state.original.transcription.chunks.map(chunk => (
              <div>
                <Card
                  bg={this.generateCardColor(chunk)}
                  text={this.generateCardTextColor(chunk)}
                  style={{ width: "95%" }}
                >
                  <Card.Header style={{ fontWeight: "bold" }}>
                    {this.formatCardHeader(chunk)}
                  </Card.Header>
                  <Card.Body>
                    <Container>
                      <Row>
                        <Col>
                          {chunk.contributions.map(contribution => (
                            <div>
                              <Row>
                                <Col
                                  xs={2}
                                  style={{
                                    fontWeight: "bold",
                                    color: this.display(chunk)
                                  }}
                                >
                                  {contribution.user.toUpperCase()}
                                </Col>
                                <Col>
                                  <div
                                    style={{
                                      display: this.display(chunk, contribution)
                                    }}
                                  >
                                    <TextField
                                      {...this.generateDisable(contribution)}
                                      defaultValue={contribution.text}
                                      style={{ width: "95%" }}
                                      onClick={() =>
                                        this.handleTextClick(
                                          chunk,
                                          contribution
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <br />
                            </div>
                          ))}
                        </Col>
                        <Col xs={2}>
                          <div className="text-center">
                            <IconButton aria-label="doneButton">
                              <CheckCircleOutlineIcon
                                style={{
                                  fontSize: 40,
                                  color: "green"
                                }}
                                onClick={e => this.handleConfirm(e, chunk)}
                              />
                            </IconButton>
                            <h6 style={{ textAlign: "center" }}>Done</h6>

                            <IconButton aria-label="playButton">
                              <PlayCircleOutlineIcon
                                color="primary"
                                style={{ fontSize: 40 }}
                                onClick={() => this.handleVideoPlay(chunk)}
                              />
                            </IconButton>
                            <h6 style={{ textAlign: "center" }}>
                              Play Segment
                            </h6>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
                <br />
              </div>
            ))}
          </FreeScrollBar>

          <Popover
            id={this.state.open ? "simple-popover" : undefined}
            open={this.state.open}
            anchorEl={this.state.currentTarget}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <h6 style={{ padding: "1em" }}>
              Please select a contribution before submission!
            </h6>
          </Popover>

          <VideoPopup
            open={this.state.videoOpen}
            src={this.props.src}
            videoClip={this.state.videoClip}
            onClose={this.handleVideoClose}
          />
        </div>
      </React.Fragment>
    );
  }

  generateCardColor = chunk => {
    return chunk.doneReview ? "success" : "core";
  };

  generateCardTextColor = chunk => {
    return chunk.doneReview ? "white" : "black";
  };

  display = (chunk, contribution) => {
    if (!contribution) {
      if (!chunk.attempted) return "black";
      return chunk.doneReview ? "#52a451" : "white";
    } else {
      if (!chunk.attempted) return "block";
      return contribution.annotations.selected ? "block" : "none";
    }
  };

  displayCard = chunk => {
    return chunk.doneReview ? "none" : "block";
  };

  generateDisable = contribution => {
    if (!contribution.annotations.selected) {
      contribution.annotations.selected = false;
      return { disabled: "disabled" };
    }
    return {};
  };

  formatCardHeader = chunk => {
    const { original } = this.state;
    let index = original.transcription.chunks.findIndex(
      c => c.starttime === chunk.starttime
    );
    const length = original.transcription.chunks.length;
    const starttime = chunk.starttime.split(",")[0];
    const endtime = chunk.endtime.split(",")[0];

    return (
      ++index +
      "/" +
      length +
      "\xa0\xa0\xa0\xa0\xa0\xa0" +
      starttime +
      " ~ " +
      endtime
    );
  };
}

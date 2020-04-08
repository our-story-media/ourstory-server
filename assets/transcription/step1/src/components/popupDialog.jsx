import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { blue } from "@material-ui/core/colors";

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};

function PopupDialog(props) {
  const { classes, open, options } = props;

  return (
    <Dialog
      onClose={props.onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <List>
        {options.map(option => (
          <ListItem button onClick={() => props.onClose(option)} key={option}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                {generateIcon(options.indexOf(option))}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={option} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function generateIcon(index) {
  switch (index) {
    case 0:
      return <SkipPreviousIcon></SkipPreviousIcon>;
    case 1:
      return <AddCircleIcon></AddCircleIcon>;
    case 2:
      return <CancelIcon></CancelIcon>;
    default:
      break;
  }
}

PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles)(PopupDialog);

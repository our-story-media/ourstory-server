import {
  ClickAwayListener,
  // Divider,
  Button,
  Fab,
  Grid,
} from "@material-ui/core";
import React, { ReactNode, useRef } from "react";
import { HelpOutline } from "@material-ui/icons";


// import useStyles from "./HeaderStyles";
// import Logo from "../../assets/images/logo_web.svg";
// import { MoreVert } from "@material-ui/icons";
import useToggle from "../../hooks/useToggle";
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type HeaderProps = {
  title: string;
  contextMenuItems: { content: ReactNode; handler: () => void }[];
  // showOnBoarding:{ handler: () => void },
  hidden?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  children,
  // title,
  // showOnBoarding,
  contextMenuItems,
  // hidden,
}) => {
  // const classes = useStyles();

  const contextMenuButtonRef = useRef(null);

  const [showContextMenu, toggleShowContextMenu, setShowContextMenu] =
    useToggle(false);

  // const hideContextMenu = () => setShowContextMenu(false);

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      {contextMenuItems.length > 0 && <Fab onClick={contextMenuItems[0].handler} style={{margin:'10px',position: "fixed",backgroundColor:"#aaa", right: '0px', bottom: '0px'}}>
        <HelpOutline />
      </Fab>
      }
      <Grid container item xs={12} justify="center" alignItems="center">
        {children}
      </Grid>
      {/* <Grid container item xs={12} justify="center" alignItems="center">
        <ClickAwayListener onClickAway={hideContextMenu}>
          <Button
            size="large"
            style={{ maxWidth: "265px" }}
            variant="outlined"
            color="primary"
            onClick={toggleShowContextMenu}
            ref={contextMenuButtonRef}
          >
            All Contributions
          </Button>
        </ClickAwayListener>
        <IndabaMenu
          show={showContextMenu}
          anchor={contextMenuButtonRef.current!}
          menuItems={contextMenuItems}
        />
      </Grid> */}
    </Grid>
  );
};

export default Header;

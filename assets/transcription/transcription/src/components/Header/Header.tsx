import {
  ClickAwayListener,
  Container,
  Divider,
  IconButton,
} from "@material-ui/core";
import React, { ReactNode, useRef } from "react";

import useStyles from "./HeaderStyles";
import Logo from "../../assets/images/logo_web.svg";
import { MoreVert } from "@material-ui/icons";
import useToggle from "../../hooks/useToggle";
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type HeaderProps = {
  title: string;
  contextMenuItems: { content: ReactNode; handler: () => void }[];
};

const Header: React.FC<HeaderProps> = ({
  children,
  title,
  contextMenuItems,
}) => {
  const classes = useStyles();

  const contextMenuButtonRef = useRef(null);

  const [showContextMenu, toggleShowContextMenu, setShowContextMenu] = useToggle(false);

  const hideContextMenu = () => setShowContextMenu(false);

  return (
    <>
      <Container>
        <div className={classes.titleRow}>
          <div className={classes.logoContainer}>
            <img src={Logo} alt="logo" width="120px" height="36px" />
            <span className={classes.buildVersion}>TITAN</span>
          </div>
          <div className={classes.titleContainer}>
            <div className={classes.titleWrapper}>{title}</div>
          </div>
          <ClickAwayListener onClickAway={hideContextMenu}>
            <IconButton
              className={classes.contextMenuButton}
              onClick={toggleShowContextMenu}
              ref={contextMenuButtonRef}
            >
              <MoreVert />
            </IconButton>
          </ClickAwayListener>
          <IndabaMenu
            show={showContextMenu}
            anchor={contextMenuButtonRef.current!}
            menuItems={contextMenuItems}
          />
        </div>
        <Divider />
      </Container>
      {children}
    </>
  );
};

export default Header;

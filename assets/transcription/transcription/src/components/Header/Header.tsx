import { Container, Divider, IconButton } from "@material-ui/core";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";

import useStyles from "./HeaderStyles";
import Logo from "../../assets/images/logo_web.svg";
import { MoreVert } from "@material-ui/icons";
import useToggle from "../../hooks/useToggle";
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type HeaderProps = {
  title: string;
  contextMenuItems: {content: ReactNode, handler: () => void}[];
};

const Header: React.FC<HeaderProps> = ({ children, title, contextMenuItems }) => {
  const classes = useStyles();

  const [showContextMenu, toggleShowContextMenu] = useToggle(false);

  const contextMenuButtonRef = useRef(null);
  const contextMenuContentRef = useRef(null);

  const memoToggleShowContextMenu = useCallback((e: MouseEvent) => {
    if (!(contextMenuButtonRef.current ? contextMenuButtonRef.current as any : { contains: true} as any).contains(e.target)) {
      toggleShowContextMenu();
    }
  }, []);

  useEffect(() => {
    showContextMenu
      ? document.addEventListener("mousedown", memoToggleShowContextMenu)
      : document.removeEventListener("mousedown", memoToggleShowContextMenu);
  }, [showContextMenu]);

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
          <IconButton
            className={classes.contextMenuButton}
            onClick={toggleShowContextMenu}
            ref={contextMenuButtonRef}
          >
            <MoreVert />
          </IconButton>
          <IndabaMenu
            show={showContextMenu}
            anchor={contextMenuButtonRef.current!}
            menuItems={contextMenuItems}
            ref={contextMenuContentRef}
          />
        </div>
        <Divider />
      </Container>
      {children}
    </>
  );
};

export default Header;

import {
  ClickAwayListener,
  Container,
  // Divider,
  Button,
} from "@material-ui/core";
import React, { ReactNode, useRef } from "react";

// import useStyles from "./HeaderStyles";
// import Logo from "../../assets/images/logo_web.svg";
// import { MoreVert } from "@material-ui/icons";
import useToggle from "../../hooks/useToggle";
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type HeaderProps = {
  title: string;
  contextMenuItems: { content: ReactNode; handler: () => void }[];
  hidden?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  children,
  // title,
  contextMenuItems,
  // hidden,
}) => {
  // const classes = useStyles();

  const contextMenuButtonRef = useRef(null);

  const [showContextMenu, toggleShowContextMenu, setShowContextMenu] =
    useToggle(false);

  const hideContextMenu = () => setShowContextMenu(false);

  return (
    <>
      <Container
        style={{
          height: "calc(100vh - 5px)",
          width: "85%",
          padding: 0,
          marginTop: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
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
      </Container>
    </>
  );
};

export default Header;

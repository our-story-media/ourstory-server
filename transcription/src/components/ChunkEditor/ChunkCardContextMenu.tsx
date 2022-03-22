// External Dependencies
import { ClickAwayListener, IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import React, { ReactNode, useRef, useState } from "react";

// Internal Dependencies
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type ChunkCardContextMenuProps = {
  menuItems: { content: ReactNode; handler: () => void }[];
};

const ChunkCardContextMenu: React.FC<ChunkCardContextMenuProps> = ({
  menuItems,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        position: "relative",
        top: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-start",
      }}
    >
      <ClickAwayListener onClickAway={() => setShowContextMenu(false)}>
        <IconButton
          style={{ padding: 4 }}
          onClick={() => setShowContextMenu(true)}
          ref={ref}
        >
          <MoreVert />
        </IconButton>
      </ClickAwayListener>
      <IndabaMenu
        show={showContextMenu}
        anchor={ref.current}
        menuItems={menuItems}
      />
    </div>
  );
};

export default ChunkCardContextMenu;

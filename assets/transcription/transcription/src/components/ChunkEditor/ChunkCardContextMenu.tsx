// External Dependencies
import { ClickAwayListener, IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import React, { ReactNode, useRef, useState } from "react";

// Internal Dependencies
import { Chunk } from "../../utils/types";
import IndabaMenu from "../IndabaMenu/IndabaMenu";

type ChunkCardContextMenuProps = {
  chunk: Chunk;
  menuItems: { content: ReactNode; handler: () => void }[];
}

const ChunkCardContextMenu: React.FC<ChunkCardContextMenuProps> = ({ chunk, menuItems }) => {

  const [showContextMenu, setShowContextMenu] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ClickAwayListener onClickAway={() => setShowContextMenu(false)}>
        <IconButton
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
import { Menu, MenuItem } from "@material-ui/core";
import React, { ReactNode } from "react";

type IndabaMenuProps = {
  anchor: null | Element;
  show: boolean;
  menuItems: { content: ReactNode; handler: () => void }[];
};

const IndabaMenu = React.forwardRef<ReactNode, IndabaMenuProps>(({ anchor, show, menuItems }, ref) => {
  return (
    <Menu ref={ref} anchorEl={anchor} open={show}>
      {menuItems.map((item, idx) => (
        <MenuItem key={idx} onClick={item.handler}>{item.content}</MenuItem>
      ))}
    </Menu>
  );
});

export default IndabaMenu;

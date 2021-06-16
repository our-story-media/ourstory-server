import { Paper } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';

const FlatPaper: React.FC<{ style?: CSSProperties }> = React.forwardRef(({ children, style }, ref) => {
    return (
        <Paper ref={ref} elevation={0} style={style}>
            {children}
        </Paper>
    );
});

export default FlatPaper;
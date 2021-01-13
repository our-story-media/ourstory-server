import { Paper } from '@material-ui/core';

const FlatPaper: React.FC<{}> = ({ children }) => {
    return (
        <Paper elevation={0}>
            {children}
        </Paper>
    );
}

export default FlatPaper;
import { Paper } from '@material-ui/core';

type FlatPaperProps = {
    className?: string;
}

const FlatPaper: React.FC<FlatPaperProps> = ({ children, className }) => {
    return (
        <Paper className={className} elevation={0}>
            {children}
        </Paper>
    );
}

export default FlatPaper;
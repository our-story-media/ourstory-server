// External Dependencies
import React from 'react';

// Styles
import useStyles from './ProgressBarStyles';

type ProgressBarProps = {
    /** The progress of the video, as a fraction */
    progress: number,
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }: ProgressBarProps) => {

    const classes = useStyles(progress);

    return (
        <div className={classes.bar}>
            <div className={classes.scrollKnob}></div>
        </div>
    );
}

export default ProgressBar;
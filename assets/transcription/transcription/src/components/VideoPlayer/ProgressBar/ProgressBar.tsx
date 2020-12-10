// External Dependencies
import React, { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableProps } from 'react-draggable';

// Styles
import useStyles from './ProgressBarStyles';

type ProgressBarProps = {
    /** The progress of the video, as a fraction */
    progress: number,
    /** A setter for telling the video that the video is being scrolled */
    setDragging: (state: boolean) => void,
    /** A callback to call whenever the user scrolls the progress bar */
    onScroll: (scrollOffset: number) => void,
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, onScroll, setDragging }: ProgressBarProps) => {
    const [initialOffset, setInitialOffset] = useState(progress);

    const classes = useStyles({barProgress: progress, initialOffset});

    const progressBarRef = useRef<HTMLDivElement>(null);

    const draggableProps: Partial<DraggableProps> = {
        axis: 'x',
        bounds: 'parent',
        positionOffset: {x: -5, y: -4},
        defaultPosition: {x: progress, y: 0},
        onDrag: (e: DraggableEvent, data: DraggableData) => {
            progressBarRef.current && onScroll(initialOffset + data.x / progressBarRef.current.getBoundingClientRect().width)
        },
        onStart: () => {setInitialOffset(progress); setDragging(true)},
        onStop: () => setDragging(false),
    };

    return (
        <div ref={progressBarRef} className={classes.bar}>
            <Draggable {...draggableProps}>
                <div className={classes.scrollKnob}></div>
            </Draggable>
        </div>
    );
}

export default ProgressBar;
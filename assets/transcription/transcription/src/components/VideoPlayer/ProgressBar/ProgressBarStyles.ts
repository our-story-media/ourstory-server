import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    bar: barProgress => ({
        width: '100%',
        height: '5px',
        borderRadius: '0px 4px 4px 0px',
        background: `linear-gradient(
            to right,
            #f54414 0%,
            #f54414 ${(Number(barProgress) * 100).toString()}%,
            transparent ${(Number(barProgress) * 100).toString()}%,
            transparent 100%
        )`,
        position: 'relative',
    }),
    scrollKnob: barProgress => ({
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #f54414 90%)',
        left: `${Number(barProgress) * 100.}%`,
        transform: 'translate(-50%, -30%)',
        position: 'absolute',
    }),
});

export default useStyles;
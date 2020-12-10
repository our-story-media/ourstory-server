import { makeStyles } from '@material-ui/core/styles';

type stylesProps = {
    barProgress: number,
    initialOffset: number,
}

const useStyles = makeStyles({
    bar: (props: stylesProps) => ({
        width: '100%',
        height: '5px',
        borderRadius: '0px 4px 4px 0px',
        background: `linear-gradient(
            to right,
            #f54414 0%,
            #f54414 ${(Number(props.barProgress) * 100).toString()}%,
            transparent ${(Number(props.barProgress) * 100).toString()}%,
            transparent 100%
        )`,
        position: 'relative',
    }),
    scrollKnob: (props: stylesProps) => ({
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #f54414 90%)',
        left: `${Number(props.initialOffset) * 100}%`,
        transform: 'translate(-5px, -5px)',
        position: 'absolute',
    }),
});

export default useStyles;
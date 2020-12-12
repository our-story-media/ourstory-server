import { makeStyles } from '@material-ui/core/styles';

type stylesProps = {
    barProgress: number,
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
});

export default useStyles;
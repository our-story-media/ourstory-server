import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    bar: barProgress => ({
        width: `calc(${barProgress.toString()} * 100%)`,
        height: '5px',
        borderRadius: '0px 4px 4px 0px',
        backgroundColor: '#f54414',
        position: 'relative',
    }),
    scrollKnob: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #f54414 90%)',
        right: '0',
        transform: 'translateY(-30%)',
        position: 'absolute',
    }
});

export default useStyles;
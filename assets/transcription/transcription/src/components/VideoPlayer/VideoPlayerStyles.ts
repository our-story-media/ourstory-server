import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    videoPlayerPlayButton: {
        position: 'absolute',
        left: '50%',
        bottom: '50%',
        transform: 'translate(-50%, 50%)',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #f54414 90%)',
    },
    videoPlayerContainer: {
        position: 'relative',
    },
    progressBarContainer: {
        left: '0',
        bottom: '0',
        transform: 'translateY(-50%)',
    },
    progressBar: {
        color: '#f54414',
    }
});

export default useStyles
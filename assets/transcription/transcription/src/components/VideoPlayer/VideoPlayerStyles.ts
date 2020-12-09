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
    }
});

export default useStyles
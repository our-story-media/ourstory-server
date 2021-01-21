import { Divider } from '@material-ui/core';
import { ReactNode } from 'react';
import useStyles from './SimpleCardStyles';

type SimpleCardProps = {
    title: ReactNode;
    style?: any
};

const SimpleCard: React.FC<SimpleCardProps> = ({ title, children, style }) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer} style={style}>
            <span>
               {title}
            </span>
            <Divider style={{ margin: "4px 0 4px 0" }}/>
            {children}
        </div>
    );
}

export default SimpleCard;
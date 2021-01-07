import { Divider } from '@material-ui/core';
import { CSSProperties, ReactNode } from 'react';
import useStyles from './SimpleCardStyles';

type SimpleCardProps = {
    title: ReactNode;
    titleStyle?: CSSProperties;
};

const SimpleCard: React.FC<SimpleCardProps> = ({ title, children, titleStyle }) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <span style={titleStyle || {}}>
               {title}
            </span>
            <Divider style={{ margin: "4px 0 4px 0" }}/>
            {children}
        </div>
    );
}

export default SimpleCard;
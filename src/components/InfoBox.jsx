import React from 'react'
import '../styles/InfoBox.css';
import { Card, CardContent, Typography } from '@mui/material';

//rfce place that to give you the layout for react function component. shortcuts.
const InfoBox = ({ title, cases, total, active, isRed, isOrangeRed, isGreen, ...props }) => {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} ${isOrangeRed && 'infoBox--orangered'}`} onClick={props.onClick}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                {/* Cases number*/}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases-green"} ${!isGreen && !isRed && "infoBox__cases-orangered"}`}>{cases}</h2>
                {/* Total */}
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox

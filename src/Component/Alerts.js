import React from 'react';
import Alert from '@mui/material/Alert';

const alertStyles = {
    width: { xs: '50%', sm: '50%', md: '50%' },
    mx: 'auto',
    textAlign: 'center',
    marginTop: '2%'
};

const CustomAlert = ({ children, severity, onClose }) => {
    return (
        <Alert onClose={onClose} severity={severity} sx={alertStyles}>
            {children}
        </Alert>
    );
};

export default CustomAlert;

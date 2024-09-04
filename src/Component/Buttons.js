import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { darken } from '@mui/system';

const CustomButton = styled(Button)(({ theme, color }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    marginTop: '1%',
    '&:hover': {
        backgroundColor: darken(theme.palette[color].main, 0.3),
    },
}));

const CustomButtonComponent = ({ children, onClick, color = 'primary', ...props }) => {
    return (
        <CustomButton onClick={onClick} color={color} {...props}>
            {children}
        </CustomButton>
    );
};

export default CustomButtonComponent;

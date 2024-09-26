import { createTheme } from '@mui/material/styles';
import { darken } from '@mui/system';

const getDarkenColor = (palette, color) => {
    switch (color) {
        case 'primary':
            return darken(palette.primary.main, 0.5);
        case 'secondary':
            return darken(palette.secondary.main, 0.5);
        case 'error':
            return darken(palette.error.main, 0.5);
        case 'warning':
            return darken(palette.warning.main, 0.5);
        case 'info':
            return darken(palette.info.main, 0.5);
        case 'success':
            return darken(palette.success.main, 0.5);
        default:
            return darken(palette.primary.main, 0.5);
    }
};

const theme = createTheme({
    palette: {
        primary: {
            light: '#e3f2fd',
            main: '#0D5369',
            dark: '#42a5f5',
            contrastText: '#fff',
        },
        secondary: {
            light: '#f3e5f5',
            main: '#ce93d8',
            dark: '#ab47bc',
            contrastText: '#fff',
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff',
        },
        warning: {
            light: '#ffb74d',
            main: '#ffa726',
            dark: '#f57c00',
            contrastText: '#fff',
        },
        info: {
            light: '#4fc3f7',
            main: '#29b6f6',
            dark: '#0288d1',
            contrastText: '#fff',
        },
        success: {
            light: '#81c784',
            main: '#66bb6a',
            dark: '#388e3c',
            contrastText: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    marginTop: '1%',
                    '&:hover': {
                        backgroundColor: (props) => getDarkenColor(theme.palette, props.color),
                    },
                },
            },
        },
    },
});

export default theme;

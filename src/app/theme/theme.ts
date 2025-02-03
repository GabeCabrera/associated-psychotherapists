export const theme = createTheme({

})
function createTheme(themeOptions: {}) {
    return {
        ...themeOptions,
        palette: {
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    };
}
// alt color 3f50b5
// light blue 6DA2D6
//background hero rgb(239, 237, 225)
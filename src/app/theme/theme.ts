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
// 6DA2D6
//rgb(239, 237, 225)
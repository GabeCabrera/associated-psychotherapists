import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    backgroundColor: 'white',
    padding: '8px 12px',
    boxShadow: '0px 5px 10px -5px rgba(128, 128, 128, 0.5)',

}));
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Menu from '@mui/material/Menu';


export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    store.history = useHistory();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleClick = () => {
        if(auth.loggedInAsGuest)
            auth.logoutAsGuest();
        handleMenuClose();
    }

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} to='/register/' style={{ height: 25 }} onClick={handleClick}>Create New Account</MenuItem>
            <Divider style={{ background: 'black' }}/>
            <MenuItem component={Link} to='/login/' style={{ height: 25 }} onClick={handleClick}>Login</MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} to='/logout/' onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
    }
    
    function getAccountMenu(loggedIn) {
        if(!loggedIn)
            return <AccountCircleOutlinedIcon style={{ fill: "black", fontSize: 40}} />;
        else {
            let initials = auth.user.firstName.charAt(0).concat(auth.user.lastName.charAt(0));
            return <Fab onClick={handleProfileMenuOpen} size="small" sx={{ pt:0.5 }} style={{ border: '1px solid black', textDecoration: 'none', backgroundColor:'#d834dc', color: 'black', fontSize: 20}}>{initials}</Fab>
        }
    }

    let accountMenu =
        <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
        >
        { <AccountCircleOutlinedIcon style={{ fill: "black", fontSize: 40}} />}
        </IconButton>;
    if(auth.loggedIn) {
        let initials = auth.user.firstName.charAt(0).concat(auth.user.lastName.charAt(0));
        accountMenu =
            <Fab onClick={handleProfileMenuOpen} size="small" sx={{ pt:0.5 }} style={{ border: '1px solid black', textDecoration: 'none', backgroundColor:'#d434dc', color: 'black', fontSize: 20}}>{initials}</Fab>;
    }

    return (
        <Box>
            <AppBar style={{ backgroundColor: '#e8e4e4'}} position="relative">
                <Toolbar>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: '#d8ac34', fontSize: 40, fontWeight: '500'}} to='/' onClick={() => auth.loggedInAsGuest ? auth.logoutAsGuest() : store.history.push('/')}>T<sup>5</sup>L</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>{}</Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        { accountMenu }
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}
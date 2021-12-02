import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import AuthContext from '../auth';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Statusbar from './Statusbar.js';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        if(auth.loggedIn)
            store.loadLists();
        else if(auth.loggedInAsGuest)
            store.loadAllLists();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleClick = () => {
    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let searchText = event.target.value.trim();
            if(store.homeSelected)
                store.homeSearchBar(searchText);
            else if(store.allListsSelected)
                store.allListsSearchBar(searchText);
            else if(store.usersSelected)
                store.usersSearchBar(searchText);
            else if(store.communityListsSelected)
                store.communityListsSearchBar(searchText);
        }
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List style={{maxHeight: '100vh', overflow: 'auto'}}>
            {
                store.lists.map((list) => (
                    <ListCard
                        key={list._id}
                        list={list}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    const menu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem style={{ height: 25 }} onClick={handleClick}>Publish Date (Newest)</MenuItem>
            <Divider style={{ background: 'black' }}/>
            <MenuItem style={{ height: 25 }} onClick={handleClick}>Publish Date (Oldest)</MenuItem>
            <Divider style={{ background: 'black' }}/>
            <MenuItem style={{ height: 25 }} onClick={handleClick}>Views</MenuItem>
            <Divider style={{ background: 'black' }}/>
            <MenuItem style={{ height: 25 }} onClick={handleClick}>Likes</MenuItem>
            <Divider style={{ background: 'black' }}/>
            <MenuItem style={{ height: 25 }} onClick={handleClick}>Dislikes</MenuItem>
        </Menu>
    );
    return (
        <Box>
            <AppBar color="transparent" style={{boxShadow: "none"}} position="relative">
                <Toolbar >
                    <Box sx={{pr: 2}}>
                    <IconButton
                        disabled={auth.loggedInAsGuest}
                        onClick={() => store.loadLists()}
                        size="small"
                        edge="start"
                        color="inherit">
                            <HomeOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                        onClick={() => store.loadAllLists()}    
                        size="small"
                        edge="start"
                        color="inherit">
                            <GroupsOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                        onClick={() => store.loadUserLists()}    
                        size="small"
                        edge="start"
                        color="inherit">
                            <PersonOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                        onClick={() => store.loadCommunityLists()}  
                        size="small"
                        edge="start"
                        color="inherit">
                            <FunctionsIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    </Box>
                <TextField
                    onKeyPress={handleKeyPress}
                    fullWidth
                    defaultValue=""
                    size="small"
                    style={{ maxWidth: "50%", backgroundColor: "white" }}
                    placeholder="Search" />
                <Box sx={{ flexGrow: 1 }}>{}</Box>
                <Box style={{ alignItems:'center' }} sx={{ display: { xs: 'none', md: 'flex'} }}>
                    <Typography style={{ fontSize: 20, fontWeight: "bold"}}>
                        SORT BY
                    </Typography>
                    <Box sx={{ pr: 1 }}>{}</Box>
                    <IconButton
                        onClick={handleMenuOpen}
                        size="small"
                        edge="end"
                        color="inherit">
                        <SortOutlinedIcon style={{ fontSize: 45 }}/>
                    </IconButton>
                </Box>
                </Toolbar>
            </AppBar>
            { menu }
            <div id="list-selector-list">
                {listCard}
            </div>
            <Statusbar/>
        </Box>)
}

export default HomeScreen;
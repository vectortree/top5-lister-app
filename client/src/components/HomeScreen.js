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
        store.loadLists();
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

    let listCard = "";
    if (store) {
        listCard = 
            <List>
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
        <div id="homescreen">
            <AppBar color="transparent" style={{ boxShadow: "none" }} position="absolute">
                <Toolbar>
                    <div id="homescreen-buttons">
                        <IconButton
                            disabled={auth.loggedInAsGuest}
                            sx={{ m: 1 , mb: 2 }}
                            size="small"
                            edge="end"
                            color="inherit">
                                <HomeOutlinedIcon style={{ fontSize: 60}}/>
                        </IconButton>
                        <IconButton
                            sx={{ m: 1 , mb: 2 }}
                            size="small"
                            edge="end"
                            color="inherit">
                                <GroupsOutlinedIcon style={{ fontSize: 60}}/>
                        </IconButton>
                        <IconButton
                            sx={{ m: 1 , mb: 2 }}
                            size="small"
                            edge="end"
                            color="inherit">
                                <PersonOutlinedIcon style={{ fontSize: 60}}/>
                        </IconButton>
                        <IconButton
                            sx={{ m: 1 , mb: 2 }}
                            size="small"
                            edge="end"
                            color="inherit">
                                <FunctionsIcon style={{ fontSize: 60}}/>
                        </IconButton>
                    </div>
                    <TextField
                        sx={{ m: 1 , mb: 2, ml: 3 }}
                        style={{ width: 600, backgroundColor: "white" }}
                        placeholder="Search" />
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Typography sx={{ m: 1 , mb: 2 }} style={{ fontSize: 20, fontWeight: "bold" }}>
                        SORT BY
                    </Typography>
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{ m: 1 , mb: 2 }}
                        size="small"
                        edge="end"
                        color="inherit">
                        <SortOutlinedIcon style={{ fontSize: 60 }}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            { menu }
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default HomeScreen;
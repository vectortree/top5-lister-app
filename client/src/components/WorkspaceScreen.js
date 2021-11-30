import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List'
import { Typography } from '@mui/material'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
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
import Statusbar from './Statusbar.js';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [buttonType, setButtonType ] = useState(null);
    store.history = useHistory();

    
    useEffect(() => {
        if(store.currentList === null || store.currentList.ownerEmail !== auth.user.email) {
            let data = store.history.location.state?.data;
            if(data) store.setCurrentList(data);
            else store.history.push("/");
        }
    }, []);

    function handleSaveList(event) {
        setButtonType("Save");
    };

    function handlePublishList(event) {
        setButtonType("Publish");
    };


    function handleSubmit(event) {
        if(buttonType === "Save") {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            store.currentList.name = data.get("list-name");
            store.currentList.items[0] = data.get("item-1");
            store.currentList.items[1] = data.get("item-2");
            store.currentList.items[2] = data.get("item-3");
            store.currentList.items[3] = data.get("item-4");
            store.currentList.items[4] = data.get("item-5");
            store.updateCurrentList();
            store.history.push('/');
        }
        else if(buttonType === "Publish") {
            // Validate input
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            store.currentList.name = data.get("list-name");
            store.currentList.items[0] = data.get("item-1");
            store.currentList.items[1] = data.get("item-2");
            store.currentList.items[2] = data.get("item-3");
            store.currentList.items[3] = data.get("item-4");
            store.currentList.items[4] = data.get("item-5");
            store.currentList.isPublished = true;
            store.updateCurrentList();
            store.history.push('/');
        }
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-workspace">
            <AppBar color="transparent" style={{ boxShadow: "none"}} position="relative">
                <Toolbar>
                    <Grid container wrap='nowrap' direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Grid item >
                            <IconButton
                                disabled={true}
                                size="small"
                                edge="start"
                                color="inherit">
                                    <HomeOutlinedIcon style={{ fontSize: 45}}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                disabled={true}
                                size="small"
                                edge="start"
                                color="inherit">
                                    <GroupsOutlinedIcon style={{ fontSize: 45}}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                disabled={true}
                                size="small"
                                edge="start"
                                color="inherit">
                                    <PersonOutlinedIcon style={{ fontSize: 45}}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                disabled={true}
                                size="small"
                                edge="start"
                                color="inherit">
                                    <FunctionsIcon style={{ fontSize: 45}}/>
                            </IconButton>
                        </Grid>
                        <Grid item >
                            <TextField
                                disabled={true}
                                style={{ width: 500, backgroundColor: "white" }}
                                defaultValue="Search" />
                        </Grid>
                        <Grid item >
                            <Typography style={{ color: '#989494', fontSize: 20, fontWeight: "bold"}}>
                                SORT BY
                            </Typography>
                        </Grid>
                        <Grid item >
                            <IconButton
                                disabled={true}
                                size="small"
                                edge="end"
                                color="inherit">
                                <SortOutlinedIcon style={{ fontSize: 45 }}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item>
                    <Card
                    id={store.currentList._id}
                    key={store.currentList._id}
                    sx={{ height: {sx: 1.0, md: 400}, width: {
                        sx: 1.0,
                        md: 1210,
                      }, marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                    disabled={store.isListNameEditActive}
                    style={{
                        fontSize: '20pt',
                        borderRadius: 15,
                        backgroundColor: "#d8d4f4",
                        alignItems: "flex-start",
                        position: "relative"
                    }}>
                        <Card
                            id={store.currentList._id}
                            key={store.currentList._id}
                            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                            disabled={store.isListNameEditActive}
                            style={{
                                fontSize: '20pt',
                                borderRadius: 15,
                                backgroundColor: "#302c74",
                                alignItems: "center"
                            }}>
                            {
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{pl: 1, flexGrow: 1 }}>
                                    <TextField id="list-name"
                                    
                                    name="list-name"
                                    autoComplete="list-name"
                                    size="small" style={{ width: 600, backgroundColor: "white" }} defaultValue={store.currentList.name}/>
                                    <Box style={{paddingTop: "2%"}} ></Box>
                                    <TextField
                                    required
                                    fullWidth
                                    id="item-1"
                                    
                                    name="item-1"
                                    autoComplete="item-1"
                                    autoFocus
                                    style={{ width: 950, backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[0]}/>
                                    <TextField
                                    required
                                    fullWidth
                                    id="item-2"
                                   
                                    name="item-2"
                                    autoComplete="item-2"
                                    autoFocus
                                    style={{ width: 950, backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[1]}/>
                                    <TextField
                                    required
                                    fullWidth
                                    id="item-3"
                                    
                                    name="item-3"
                                    autoComplete="item-3"
                                    autoFocus
                                    style={{ width: 950, backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[2]}/>
                                    <TextField
                                    required
                                    fullWidth
                                    id="item-4"
                                    
                                    name="item-4"
                                    autoComplete="item-4"
                                    autoFocus
                                    style={{ width: 950, backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[3]}/>
                                    <TextField
                                    required
                                    fullWidth
                                    id="item-5"
                                    
                                    name="item-5"
                                    autoComplete="item-5"
                                    autoFocus
                                    style={{ width: 950, backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[4]}/>
                                    <Button
                                        onClick={handleSaveList}
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 5, ml: 2 }}
                                        >
                                        Save
                                    </Button>
                                    <Button
                                       onClick={handlePublishList}
                                       type="submit"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 5, ml: 1}}
                                        >
                                        Publish
                                    </Button>
                                </Box>
                            }
                        </Card>
                        
                    </Card>
                </Grid>
            </Grid>
            <Statusbar/>
        </div>)
}

export default WorkspaceScreen;
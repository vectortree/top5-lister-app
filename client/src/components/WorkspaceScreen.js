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
    const [flag, setFlag] = useState(false);
    const [listName, setListName] = useState(store.currentList.name);
    const [item1, setItem1] = useState(store.currentList.items[0]);
    const [item2, setItem2] = useState(store.currentList.items[1]);
    const [item3, setItem3] = useState(store.currentList.items[2]);
    const [item4, setItem4] = useState(store.currentList.items[3]);
    const [item5, setItem5] = useState(store.currentList.items[4]);
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

    function handleChangeListName(event) {
        let text = event.target.value;
        setListName(text);
    }

    function handleChangeItem1(event) {
        let text = event.target.value;
        setItem1(text);
    }

    function handleChangeItem2(event) {
        let text = event.target.value;
        setItem2(text);
    }
    function handleChangeItem3(event) {
        let text = event.target.value;
        setItem3(text);
    }
    function handleChangeItem4(event) {
        let text = event.target.value;
        setItem4(text);
    }
    function handleChangeItem5(event) {
        let text = event.target.value;
        setItem5(text);
    }

    function handlePublishList(event) {
        setButtonType("Publish");
    };

    function handleSubmit(event) {
        if(buttonType === "Save") {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            store.currentList.name = data.get("list-name").trim();
            store.currentList.items[0] = data.get("item-1").trim();
            store.currentList.items[1] = data.get("item-2").trim();
            store.currentList.items[2] = data.get("item-3").trim();
            store.currentList.items[3] = data.get("item-4").trim();
            store.currentList.items[4] = data.get("item-5").trim();
            store.updateCurrentList();
            store.history.push('/');
        }
        else if(buttonType === "Publish") {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            store.currentList.name = data.get("list-name").trim();
            store.currentList.items[0] = data.get("item-1").trim();
            store.currentList.items[1] = data.get("item-2").trim();
            store.currentList.items[2] = data.get("item-3").trim();
            store.currentList.items[3] = data.get("item-4").trim();
            store.currentList.items[4] = data.get("item-5").trim();
            store.currentList.isPublished = true;
            store.updateCurrentList();
            store.history.push('/');
            store.updateCommunityList(store.currentList);
        }
    }
    
    function isFormValid() {
        return notBlank() && startsWithAlphanumeric() && !duplicateList() && !duplicateItems();
    }
    function duplicateList() {
        for(let i = 0; i < store.lists.length; i++) {
            if(store.lists[i].isPublished && store.lists[i].name.localeCompare(listName.trim(), undefined, {sensitivity: 'accent'})===0)
                return true;
        }
        return false;
    }

    function notBlank() {
        return (listName.trim() !== ""
        && item1.trim() !== ""
        && item2.trim() !== ""
        && item3.trim() !== ""
        && item4.trim() !== ""
        && item5.trim() !== "");
    }
    
    function startsWithAlphanumeric() {
        return (/[a-zA-Z0-9]/).test(listName.trim()[0])
        && (/[a-zA-Z0-9]/).test(item1.trim()[0])
        && (/[a-zA-Z0-9]/).test(item2.trim()[0])
        && (/[a-zA-Z0-9]/).test(item3.trim()[0])
        && (/[a-zA-Z0-9]/).test(item4.trim()[0])
        && (/[a-zA-Z0-9]/).test(item5.trim()[0]);
    }

    function duplicateItems() {
        return (item1.trim().localeCompare(item2.trim(), undefined, {sensitivity: 'accent'})===0
        || item1.trim().localeCompare(item3.trim(), undefined, {sensitivity: 'accent'})===0
        || item1.trim().localeCompare(item4.trim(), undefined, {sensitivity: 'accent'})===0
        || item1.trim().localeCompare(item5.trim(), undefined, {sensitivity: 'accent'})===0
        || item2.trim().localeCompare(item3.trim(), undefined, {sensitivity: 'accent'})===0
        || item2.trim().localeCompare(item4.trim(), undefined, {sensitivity: 'accent'})===0
        || item2.trim().localeCompare(item5.trim(), undefined, {sensitivity: 'accent'})===0
        || item3.trim().localeCompare(item4.trim(), undefined, {sensitivity: 'accent'})===0
        || item3.trim().localeCompare(item5.trim(), undefined, {sensitivity: 'accent'})===0
        || item4.trim().localeCompare(item5.trim(), undefined, {sensitivity: 'accent'})===0);
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
        <Box>
            <AppBar color="transparent" style={{boxShadow: "none"}} position="relative">
                <Toolbar >
                    <Box sx={{pr: 2}}>
                    <IconButton
                        disabled={auth.loggedInAsGuest}
                        disabled={true}
                        size="small"
                        edge="start"
                        color="inherit">
                            <HomeOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                            
                        size="small"
                        disabled={true}
                        edge="start"
                        color="inherit">
                            <GroupsOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                            
                        size="small"
                        disabled={true}
                        edge="start"
                        color="inherit">
                            <PersonOutlinedIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    <IconButton
                        
                        size="small"
                        disabled={true}
                        edge="start"
                        color="inherit">
                            <FunctionsIcon style={{ fontSize: 45}}/>
                    </IconButton>
                    </Box>
                <TextField
                    fullWidth
                    disabled={true}
                    size="small"
                    style={{ maxWidth: "50%", backgroundColor: "white" }}
                    placeholder="Search" />
                <Box sx={{ flexGrow: 1 }}>{}</Box>
                <Box style={{ alignItems:'center' }} sx={{ display: { xs: 'none', md: 'flex'} }}>
                    <Typography style={{ color: '#989494', fontSize: 20, fontWeight: "bold"}}>
                        SORT BY
                    </Typography>
                    <Box sx={{ pr: 1 }}>{}</Box>
                    <IconButton
                        disabled={true}
                        size="small"
                        edge="end"
                        color="inherit">
                        <SortOutlinedIcon style={{ fontSize: 45 }}/>
                    </IconButton>
                </Box>
                </Toolbar>
            </AppBar>
            <Card
                    sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                    disabled={store.isListNameEditActive}
                    style={{
                        fontSize: '20pt',
                        borderRadius: 15,
                        backgroundColor: "#d8d4f4",
                        alignItems: "flex-start",
                        position: "relative"
                    }}>
                    <Card
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
                                onChange={handleChangeListName}
                                name="list-name"
                                autoComplete="list-name"
                                size="small" style={{ backgroundColor: "white" }} defaultValue={store.currentList.name}/>
                                <Box style={{paddingTop: "2%"}} ></Box>
                                <TextField
                                required
                                fullWidth
                                id="item-1"
                                onChange={handleChangeItem1}
                                name="item-1"
                                autoComplete="item-1"
                         
                                style={{ backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[0]}/>
                                <TextField
                                required
                                fullWidth
                                id="item-2"
                                onChange={handleChangeItem2}
                                name="item-2"
                                autoComplete="item-2"
                              
                                style={{ backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[1]}/>
                                <TextField
                                required
                                fullWidth
                                id="item-3"
                                onChange={handleChangeItem3}
                                name="item-3"
                                autoComplete="item-3"
                            
                                style={{backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[2]}/>
                                <TextField
                                required
                                fullWidth
                                id="item-4"
                                onChange={handleChangeItem4}
                                name="item-4"
                                autoComplete="item-4"
                       
                                style={{backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[3]}/>
                                <TextField
                                required
                                fullWidth
                                id="item-5"
                                onChange={handleChangeItem5}
                                name="item-5"
                                autoComplete="item-5"
                           
                                style={{backgroundColor: "#d8ac34" }} defaultValue={store.currentList.items[4]}/>
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
                                    disabled={!isFormValid()}
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
            <Statusbar/>
        </Box>)
}

export default WorkspaceScreen;
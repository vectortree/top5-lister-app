import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
    const [listName, setListName] = useState("");
    const [item1, setItem1] = useState("");
    const [item2, setItem2] = useState("");
    const [item3, setItem3] = useState("");
    const [item4, setItem4] = useState("");
    const [item5, setItem5] = useState("");
    const [buttonType, setButtonType ] = useState(null);
    store.history = useHistory();

    useEffect(() => {
        if(store.currentList === null) {
            let data = store.history.location.state?.data;
            if(data) {
                store.currentList = data;
                setListName(data.name);
                setItem1(data.items[0]);
                setItem2(data.items[1]);
                setItem3(data.items[2]);
                setItem4(data.items[3]);
                setItem5(data.items[4]);
            }
            else store.history.push("/");
        }
        else {
            setListName(store.currentList.name);
            setItem1(store.currentList.items[0]);
            setItem2(store.currentList.items[1]);
            setItem3(store.currentList.items[2]);
            setItem4(store.currentList.items[3]);
            setItem5(store.currentList.items[4]);
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

        }
        else if(buttonType === "Publish") {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            let newDate = new Date().toString();
            store.currentList.name = data.get("list-name").trim();
            store.currentList.items[0] = data.get("item-1").trim();
            store.currentList.items[1] = data.get("item-2").trim();
            store.currentList.items[2] = data.get("item-3").trim();
            store.currentList.items[3] = data.get("item-4").trim();
            store.currentList.items[4] = data.get("item-5").trim();
            store.currentList.isPublished = true;
            store.currentList.publishedDate = newDate;
            store.updateCurrentList();
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

    return (
        <div id='workspace-screen'>
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
            <Box style={{margin: 'auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}>
            <Card
                    fullWidth
                    sx={{ height: 'auto', width: '95%', bgcolor: 'background.paper',
                    marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                    disabled={store.isListNameEditActive}
                    style={{
                        fontSize: '20pt',
                        borderRadius: 15,
                        backgroundColor: "#d8d4f4",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                    }}>
                    <Card
                        fullWidth
                        sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                        disabled={store.isListNameEditActive}
                        style={{
                            fontSize: '20pt',
                            borderRadius: 15,
                            backgroundColor: "#302c74",
                            alignItems: "center"
                        }}>
                        {
                            <Box style={{maxWidth: "98%"}} component="form" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} onSubmit={handleSubmit} noValidate sx={{pl: 1, flexGrow: 1 }}>
                                <Box style={{paddingTop: "1%"}} ></Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <TextField id="list-name"
                                required
                                fullWidth
                                onChange={handleChangeListName}
                                name="list-name"
                                autoComplete="off"
                                size="small" style={{ backgroundColor: "white", borderRadius: 15 }} defaultValue={store.currentList ? store.currentList.name : store.history.location.state?.data.name}/>
                                </Box>
                                <Box style={{paddingTop: "2%"}} ></Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography color="#d8ac34" variant="h3">1.</Typography>
                                <Typography color="#d8ac34" variant="h3"> &nbsp;</Typography>
                                <TextField
                                required
                                fullWidth
                                id="item-1"
                                onChange={handleChangeItem1}
                                name="item-1"
                                autoComplete="off"
                                style={{ backgroundColor: "#d8ac34", borderRadius: 15 }} defaultValue={store.currentList ? store.currentList.items[0] : store.history.location.state?.data.items[0]}/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography color="#d8ac34" variant="h3">2.</Typography>
                                <Typography color="#d8ac34" variant="h3"> &nbsp;</Typography>
                                <TextField
                                required
                                fullWidth
                                id="item-2"
                                onChange={handleChangeItem2}
                                name="item-2"
                                autoComplete="off"
                              
                                style={{ backgroundColor: "#d8ac34", borderRadius: 15  }} defaultValue={store.currentList ? store.currentList.items[1] : store.history.location.state?.data.items[1]}/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography color="#d8ac34" variant="h3">3.</Typography>
                                <Typography color="#d8ac34" variant="h3"> &nbsp;</Typography>
                                <TextField
                                required
                                fullWidth
                                id="item-3"
                                onChange={handleChangeItem3}
                                name="item-3"
                                autoComplete="off"
                            
                                style={{backgroundColor: "#d8ac34", borderRadius: 15  }} defaultValue={store.currentList ? store.currentList.items[2]: store.history.location.state?.data.items[2]}/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography color="#d8ac34" variant="h3">4.</Typography>
                                <Typography color="#d8ac34" variant="h3"> &nbsp;</Typography>
                                <TextField
                                required
                                fullWidth
                                id="item-4"
                                onChange={handleChangeItem4}
                                name="item-4"
                                autoComplete="off"
                       
                                style={{backgroundColor: "#d8ac34",borderRadius: 15  }} defaultValue={store.currentList ? store.currentList.items[3] : store.history.location.state?.data.items[3]}/>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Typography color="#d8ac34" variant="h3">5.</Typography>
                                <Typography color="#d8ac34" variant="h3"> &nbsp;</Typography>
                                <TextField
                                required
                                fullWidth
                                id="item-5"
                                onChange={handleChangeItem5}
                                name="item-5"
                                autoComplete="off"
                           
                                style={{backgroundColor: "#d8ac34",borderRadius: 15  }} defaultValue={store.currentList ? store.currentList.items[4] : store.history.location.state?.data.items[4]}/>
                                </Box>
                                <Box style={{paddingTop: "2%"}} ></Box>
                                <Button
                                    onClick={handleSaveList}
                                    type="submit"
                                    variant="contained"
        
                                    >
                                    Save
                                </Button>
                                <Button
                                    onClick={handlePublishList}
                                    disabled={!isFormValid()}
                                    type="submit"
                                    variant="contained"
                                    
                                    >
                                    Publish
                                </Button>
                                <Box style={{paddingBottom: "1%"}} ></Box>
                            </Box>
                        }
                    </Card>
                    <Box style={{paddingBottom: "1.5%"}} ></Box>
                </Card>
                </Box>
        </Box></div>)
}

export default WorkspaceScreen;
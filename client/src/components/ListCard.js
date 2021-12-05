import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AuthContext from '../auth';
import moment from 'moment';
import List from '@mui/material/List';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [isExpanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const { list } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let comment = text.trim();
            if (comment !== "") {
                let pair = {
                    key: auth.user.userName,
                    value: comment
                };
                setText("");
                list.comments.unshift(pair);
                if(store.communityListsSelected) {
                    store.updateCommunityListInfo(list);
                }
                else store.updateList(list);
            }
        }
    }

    function handleChange(event) {
        let text = event.target.value;
        setText(text);
    }

    function handleIncrementViewCount() {
        setExpanded(true);
        list.numberOfViews = list.numberOfViews+1;
        if(store.communityListsSelected) {
            store.updateCommunityListInfo(list);
        }
        else store.updateList(list);
    }

    function hasBeenLiked(id) {
        for(let i = 0; i < list.userLikes.length; i++) {
            if(auth.user.userName === list.userLikes[i])
                return true;
        }
        return false;
    }
    function hasBeenDisliked(id) {
        for(let i = 0; i < list.userDislikes.length; i++) {
            if(auth.user.userName === list.userDislikes[i])
                return true;
        }
        return false;
    }

    function handleLike() {
        let liked = hasBeenLiked(list._id);
        let disliked = hasBeenDisliked(list._id);
        if(!liked && !disliked) {
            list.userLikes.push(auth.user.userName);
            list.numberOfLikes = list.numberOfLikes+1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
        else if(!liked && disliked) {
            list.userLikes.push(auth.user.userName);
            list.userDislikes = list.userDislikes.filter(item => item !== auth.user.userName);
            list.numberOfLikes = list.numberOfLikes+1;
            list.numberOfDislikes = list.numberOfDislikes-1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
        else if(liked && !disliked) {
            list.userLikes = list.userLikes.filter(item => item !== auth.user.userName);
            list.numberOfLikes = list.numberOfLikes-1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
    }
    function handleDislike() {
        let liked = hasBeenLiked(list._id);
        let disliked = hasBeenDisliked(list._id);
        if(!liked && !disliked) {
            list.userDislikes.push(auth.user.userName);
            list.numberOfDislikes = list.numberOfDislikes+1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
        else if(liked && !disliked) {
            list.userDislikes.push(auth.user.userName);
            list.userLikes = list.userLikes.filter(item => item !== auth.user.userName);
            list.numberOfDislikes = list.numberOfDislikes+1;
            list.numberOfLikes = list.numberOfLikes-1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
        else if(!liked && disliked) {
            list.userDislikes = list.userDislikes.filter(item => item !== auth.user.userName);
            list.numberOfDislikes = list.numberOfDislikes-1;
            if(store.communityListsSelected) {
                store.updateCommunityListInfo(list);
            }
            else store.updateList(list);
        }
    }

    let cardElement = ""
    if(store.communityListsSelected) {
        if(!isExpanded) {
        cardElement =
            <Card
                color={"#d8d4f4"}
                id={list._id}
                key={list._id}
                sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
            
                style={{
                    fontSize: '20pt',
                    borderRadius: 15,
                    backgroundColor: "#d8d4f4",
                }}
            >
                <Grid container container wrap='nowrap' direction="row" justifyContent="space-between" alignItems="flex-center">     
                    <Grid item>       
                    <Box sx={{ pl: 1, flexGrow: 1 }}>
                        <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                        <Typography variant="subtitle1" style={{ fontSize: '12pt'}}></Typography>
                        <Box style={{paddingBottom: "34%"}} ></Box>
                        <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} display="inline">Updated:</Typography>
                        <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.updatedDate).format('MMM D, YYYY')}</Typography>
                    </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: '17pt'}} >
                            <IconButton disabled={auth.loggedInAsGuest} isableRipple={true} onClick={handleLike}>
                                <ThumbUpOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            {list.numberOfLikes}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleDislike}>
                                <ThumbDownOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            {list.numberOfDislikes}
                        </Typography>
                        <Typography variant="h2" display="inline" style={{ fontSize: '12pt'}} >
                            Views:
                        </Typography>
                        <Typography variant="h2" display="inline" style={{ fontSize: '12pt', color: 'red'}}>{" "+list.numberOfViews}</Typography>
                    </Grid>
                    <Grid item>
                        { store.homeSelected ?
                            <Box>
                                <IconButton disableRipple={true} onClick={(event) => {
                                    handleDeleteList(event, list._id)
                                }} aria-label='delete'>
                                    <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                                </IconButton>
                            </Box> : <Box style={{paddingBottom: "100%"}} ></Box>
                        }
                        <Box style={{ alignSelf: "end" }}>
                            <IconButton disableRipple={true} onClick={handleIncrementViewCount}>
                                <KeyboardArrowDownIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Card>;
        }
        if(isExpanded) {
                cardElement =

                <Card
                color={"#d8d4f4"}
                id={list._id}
                key={list._id}
                sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
            
                style={{
                    fontSize: '20pt',
                    borderRadius: 15,
                    backgroundColor: "#d8d4f4",
                }}
            >
                <Grid container container wrap='nowrap' direction="row" justifyContent="space-between">     
                    <Grid item>
                    <Box sx={{ pl: 1, flexGrow: 1 }} >
                        <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                        <Card
                            fullWidth
                            id={list._id}
                            key={list._id}
                            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                            style={{
                                fontSize: '20pt',
                                borderRadius: 15,
                                backgroundColor: "#302c74",
                                alignItems: "flex-center",
                                maxWidth: 400,
                                minWidth: 400,
                                display: 'block',
                                wordBreak: 'break-all'
                            }}>
                            {
                                <Box sx={{pl: 1, flexGrow: 1 }}>
                                    <Typography color="#d8ac34" variant="h3">{'1. ' + list.items[0]}</Typography>
                                    <Typography color="#d8ac34" variant="h6">{'(' + list.itemPointPairs[0].value + ' Votes)'}</Typography>
                                    <Typography color="#d8ac34" variant="h3">{'2. ' + list.items[1]}</Typography>
                                    <Typography color="#d8ac34" variant="h6">{'(' + list.itemPointPairs[1].value + ' Votes)'}</Typography>
                                    <Typography color="#d8ac34" variant="h3">{'3. ' + list.items[2]}</Typography>
                                    <Typography color="#d8ac34" variant="h6">{'(' + list.itemPointPairs[2].value + ' Votes)'}</Typography>
                                    <Typography color="#d8ac34" variant="h3">{'4. ' + list.items[3]}</Typography>
                                    <Typography color="#d8ac34" variant="h6">{'(' + list.itemPointPairs[3].value + ' Votes)'}</Typography>
                                    <Typography color="#d8ac34" variant="h3">{'5. ' + list.items[4]}</Typography>
                                    <Typography color="#d8ac34" variant="h6">{'(' + list.itemPointPairs[4].value + ' Votes)'}</Typography>
                                </Box>
                            }
                        </Card>
                        <Box style={{paddingBottom: "3%"}} ></Box>
                        <Typography variant="subtitle1" style={{ fontSize: '12pt' }} display="inline">Updated:</Typography>
                        <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.updatedDate).format('MMM D, YYYY')}</Typography>
                    </Box>
                    </Grid>
                    <Grid item >
                        <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: '17pt'}} >
                            <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleLike}>
                                <ThumbUpOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            {list.numberOfLikes}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleDislike}>
                                <ThumbDownOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            {list.numberOfDislikes}
                        </Typography>
                        <Typography variant="h2" display="inline" style={{ fontSize: '12pt'}} >
                            Views:
                        </Typography>
                        <Typography variant="h2" display="inline" style={{ fontSize: '12pt', color: 'red'}}>{" "+list.numberOfViews}</Typography>
                    </Grid>
                    <Grid item >
                        { store.homeSelected ?
                            <Box >
                                <IconButton disableRipple={true} onClick={(event) => {
                                    handleDeleteList(event, list._id)
                                }} aria-label='delete'>
                                    <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                                </IconButton>
                            </Box> : null
                        }
                    </Grid>
                    <Grid item sx={{pl: 1, flexShrink: 1}} >
                        <Box style={{paddingTop: '2%'}}/>
                        <List style={{ minWidth: 400, maxWidth: 400, maxHeight: 450, overflow: 'scroll'}}>
                            {
                                list.comments.map((item) => (
                                    <Card
                                    sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                                    style={{
                                        fontSize: '15pt',
                                        borderRadius: 15,
                                        backgroundColor: "#d8ac34",
                                        color: "#302c74",
                                        alignItems: "flex-start",
                                        display: 'block',
                                        wordBreak: 'break-all'
                                    }}>
                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                            <Typography component="div" variant="title" style={{ fontSize: '12pt'}}>
                                                <Link to='#'>{item.key}</Link>
                                            </Typography>
                                            <Typography color="black" variant="h6" component="div" style={{ fontSize: '15pt'}}>
                                                {item.value}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </List>
                        { auth.loggedInAsGuest ? null :
                            <TextField
                                justifyContent="flex-end"
                                margin="normal"
                                size="small"
                                value={text}
                                placeholder="Add Comment"
                                style={{ backgroundColor:"white" }}
                                required
                                fullWidth
                                name="comment"
                                autoComplete="Comment"
                                onKeyPress={handleKeyPress}
                                onChange={handleChange}
                                autoFocus
                            />
                        }
                    </Grid>
                    <Grid item>
                        <Box style={{ alignContent: "end" }}>
                            <IconButton disableRipple={true} onClick={() => setExpanded(false)}>
                                <KeyboardArrowUpIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Card>;
        }
    }
    else {
    if(!list.isPublished && !isExpanded)
        cardElement =
        <Card
            id={list._id}
            key={list._id}
            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
            
            style={{
                fontSize: '20pt',
                borderRadius: 15,
                backgroundColor: "#fffcf4",
            }}
        >
            <Grid container container wrap='nowrap' direction="row" justifyContent="space-between" alignItems="flex-center">     
                <Grid item>       
                    <Box sx={{ pl: 1, flexGrow: 1 }}>
                        <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                        <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: <Link to='#'>{list.userName}</Link></Typography>
                        <Typography component={Link} to='#' onClick={(event) => {handleLoadList(event, list._id)}} variant="subtitle1" style={{ fontSize: '12pt', color: 'red' }} >Edit</Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box style={{ alignSelf:"flex-end" }} >
                    <IconButton disableRipple={true} onClick={(event) => {
                        handleDeleteList(event, list._id)
                    }} aria-label='delete'>
                        <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
                    <Box style={{ alignSelf: "end" }}>
                        <IconButton disableRipple={true} onClick={() => setExpanded(true)}>
                            <KeyboardArrowDownIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Card>;
    if(!list.isPublished && isExpanded)
    cardElement =
        <Card
            id={list._id}
            key={list._id}
            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
           
            style={{
                fontSize: '20pt',
                borderRadius: 15,
                backgroundColor: "#fffcf4",
                alignItems: "flex-start"
            }}
        >
            <Grid container container wrap='nowrap' direction="row" justifyContent="space-between">
            <Grid item>
            <Box sx={{ pl: 1, flexGrow: 1 }}>
                <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: <Link to='#'>{list.userName}</Link></Typography>
                <Card
                    fullWidth
                    id={list._id}
                    key={list._id}
                    sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                    style={{
                        fontSize: '20pt',
                        borderRadius: 15,
                        backgroundColor: "#302c74",
                        alignItems: "flex-center",
                        maxWidth: 400,
                        minWidth: 400,
                        display: 'block',
                        wordBreak: 'break-all'
                    }}>
                    {
                        <Box sx={{pl: 1, flexGrow: 1 }}>
                        <Typography color="#d8ac34" variant="h3">{'1. ' + list.items[0]}</Typography>
                        <Typography color="#d8ac34" variant="h3">{'2. ' + list.items[1]}</Typography>
                        <Typography color="#d8ac34" variant="h3">{'3. ' + list.items[2]}</Typography>
                        <Typography color="#d8ac34" variant="h3">{'4. ' + list.items[3]}</Typography>
                        <Typography color="#d8ac34" variant="h3">{'5. ' + list.items[4]}</Typography>
                    </Box>
                    }
                </Card>
                <Box style={{paddingBottom: "6%"}} ></Box>
                <Typography component={Link} to="" onClick={(event) => {handleLoadList(event, list._id)}} variant="subtitle1" style={{ fontSize: '12pt', color: 'red'}} >Edit</Typography>
            </Box>
            </Grid>
            <Grid item>
                <Box style={{ alignSelf:"flex-end" }} >
                    <IconButton disableRipple={true} onClick={(event) => {
                        handleDeleteList(event, list._id)
                    }} aria-label='delete'>
                        <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
                <Box style={{ alignSelf: "end" }}>
                    <IconButton disableRipple={true} onClick={() => setExpanded(false)}>
                        <KeyboardArrowUpIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </Box>
            </Grid>
            </Grid>
        </Card>;
    if(list.isPublished && !isExpanded)
    cardElement =
        <Card
            color={"#d8d4f4"}
            id={list._id}
            key={list._id}
            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
           
            style={{
                fontSize: '20pt',
                borderRadius: 15,
                backgroundColor: "#d8d4f4",
            }}
        >
            <Grid container container wrap='nowrap' direction="row" justifyContent="space-between" alignItems="flex-center">     
                <Grid item>       
                <Box sx={{ pl: 1, flexGrow: 1 }}>
                    <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                    <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: <Link to='#'>{list.userName}</Link></Typography>
                    { !store.communityListsSelected ? <Typography variant="subtitle1" style={{ fontSize: '12pt' }} display="inline">Published:</Typography> :
                    <Typography variant="subtitle1" style={{ fontSize: '12pt' }} display="inline">Updated:</Typography> }
                    { !store.communityListsSelected ? <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.publishedDate).format('MMM D, YYYY')}</Typography> :
                    <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.updatedDate).format('MMM D, YYYY')}</Typography>
                    }
                </Box>
                </Grid>
                <Grid item>
                    <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: '17pt'}} >
                        <IconButton disabled={auth.loggedInAsGuest} isableRipple={true} onClick={handleLike}>
                            <ThumbUpOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        {list.numberOfLikes}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleDislike}>
                            <ThumbDownOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        {list.numberOfDislikes}
                    </Typography>
                    <Typography variant="h2" display="inline" style={{ fontSize: '12pt'}} >
                        Views:
                    </Typography>
                    <Typography variant="h2" display="inline" style={{ fontSize: '12pt', color: 'red'}}>{" "+list.numberOfViews}</Typography>
                </Grid>
                <Grid item>
                    { store.homeSelected ?
                        <Box>
                            <IconButton disableRipple={true} onClick={(event) => {
                                handleDeleteList(event, list._id)
                            }} aria-label='delete'>
                                <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        </Box> : null
                    }
                    <Box style={{ alignSelf: "end" }}>
                        <IconButton disableRipple={true} onClick={handleIncrementViewCount}>
                            <KeyboardArrowDownIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Card>;

        if(list.isPublished && isExpanded) {
            cardElement =

            <Card
            color={"#d8d4f4"}
            id={list._id}
            key={list._id}
            sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
           
            style={{
                fontSize: '20pt',
                borderRadius: 15,
                backgroundColor: "#d8d4f4",
            }}
        >
            <Grid container container wrap='nowrap' direction="row" justifyContent="space-between" alignItems="flex-center">     
                <Grid item>       
                <Box sx={{ pl: 1, flexGrow: 1 }}>
                    <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                    <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: <Link to='#'>{list.userName}</Link></Typography>
                    <Card
                        fullWidth
                        id={list._id}
                        key={list._id}
                        sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                        style={{
                            fontSize: '20pt',
                            borderRadius: 15,
                            backgroundColor: "#302c74",
                            alignItems: "flex-start",
                            maxWidth: 400,
                            minWidth: 400,
                            display: 'block',
                            wordBreak: 'break-all'
                        }}>
                        {
                            <Box sx={{pl: 1, flexGrow: 1 }}>
                                <Typography color="#d8ac34" variant="h3">{'1. ' + list.items[0]}</Typography>
                                <Typography color="#d8ac34" variant="h3">{'2. ' + list.items[1]}</Typography>
                                <Typography color="#d8ac34" variant="h3">{'3. ' + list.items[2]}</Typography>
                                <Typography color="#d8ac34" variant="h3">{'4. ' + list.items[3]}</Typography>
                                <Typography color="#d8ac34" variant="h3">{'5. ' + list.items[4]}</Typography>
                            </Box>
                        }
                    </Card>
                    <Box style={{paddingBottom: "5%"}} ></Box>
                    { !store.communityListsSelected ? <Typography variant="subtitle1" style={{ fontSize: '12pt' }} display="inline">Published:</Typography> :
                    <Typography variant="subtitle1" style={{ fontSize: '12pt' }} display="inline">Updated:</Typography> }
                    { !store.communityListsSelected ? <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.publishedDate).format('MMM D, YYYY')}</Typography> :
                    <Typography color="#80bc7c" variant="subtitle1" style={{ fontSize: '12pt' }} display="inline" >{" " + moment(list.updatedDate).format('MMM D, YYYY')}</Typography>
                    }
                </Box>
                </Grid>
                <Grid item>
                <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: '17pt'}} >
                        <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleLike}>
                            <ThumbUpOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        {list.numberOfLikes}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <IconButton disabled={auth.loggedInAsGuest} disableRipple={true} onClick={handleDislike}>
                            <ThumbDownOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        {list.numberOfDislikes}
                    </Typography>
                    <Typography variant="h2" display="inline" style={{ fontSize: '12pt'}} >
                        Views:
                    </Typography>
                    <Typography variant="h2" display="inline" style={{ fontSize: '12pt', color: 'red'}}>{" "+list.numberOfViews}</Typography>
                </Grid>
                <Grid item sx={{pl: 1, flexShrink: 1}} >
                    <Box style={{paddingTop: '2%'}}/>
                    <List style={{ minWidth: 400, maxWidth: 400, maxHeight: 350, overflow: 'scroll'}}>
                        {
                            list.comments.map((item) => (
                                <Card
                                sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                                style={{
                                    fontSize: '15pt',
                                    borderRadius: 15,
                                    backgroundColor: "#d8ac34",
                                    color: "#302c74",
                                    alignItems: "flex-start",
                                    display: 'block',
                                    wordBreak: 'break-all'
                                }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography component="div" variant="title" style={{ fontSize: '12pt'}}>
                                            <Link to='#'>{item.key}</Link>
                                        </Typography>
                                        <Typography color="black" variant="h6" component="div" style={{ fontSize: '15pt'}}>
                                            {item.value}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </List>
                    { auth.loggedInAsGuest ? null :
                        <TextField
                            justifyContent="flex-end"
                            margin="normal"
                            size="small"
                            value={text}
                            placeholder="Add Comment"
                            style={{ backgroundColor:"white" }}
                            required
                            fullWidth
                            name="comment"
                            autoComplete="Comment"
                            onKeyPress={handleKeyPress}
                            onChange={handleChange}
                            autoFocus
                        />
                    }
                </Grid>
                <Grid item>
                    { store.homeSelected ?
                        <Box style={{ alignSelf:"flex-end" }} >
                            <IconButton disableRipple={true} onClick={(event) => {
                                handleDeleteList(event, list._id)
                            }} aria-label='delete'>
                                <DeleteOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        </Box> : null
                    }
                    <Box style={{ alignSelf: "end" }}>
                        <IconButton disableRipple={true} onClick={() => setExpanded(false)}>
                            <KeyboardArrowUpIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Card>;
        }
    }

    return (
        cardElement
    );
}

export default ListCard;
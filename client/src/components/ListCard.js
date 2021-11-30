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
import { Link } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [isExpanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const { list } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        else store.setListNameEditNotActive();
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        let text = event.target.value.trim();
        if(text !== "")
            setText(text);
        else setText(list.name);
    }

    let cardElement = ""
    if(!list.isPublished && !isExpanded)
        cardElement =
        <Card
            id={list._id}
            key={list._id}
            sx={{ width: {
                sx: 1.0,
                md: 1210,
              }, marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
            disabled={store.isListNameEditActive}
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
                        <Typography component={Link} to='#' onClick={(event) => {handleLoadList(event, list._id)}} variant="subtitle1" style={{ fontSize: '12pt' }} >Edit</Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box>
                        <IconButton disableRipple={true} disabled={store.isListNameEditActive} onClick={(event) => {
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
            sx={{ width: {
                xs: 1.0,
                md: 1210,
              }, marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
            disabled={store.isListNameEditActive}
            style={{
                fontSize: '20pt',
                borderRadius: 15,
                backgroundColor: "#fffcf4",
                alignItems: "flex-start"
            }}
        >
            <Box sx={{ pl: 1, flexGrow: 1 }}>
                <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: <Link to='#'>{list.userName}</Link></Typography>
                <Card
                    id={list._id}
                    key={list._id}
                    sx={{ width: {
                        xs: 1.0,
                        md: 1000,
                      }, marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                    disabled={store.isListNameEditActive}
                    style={{
                        fontSize: '20pt',
                        borderRadius: 15,
                        backgroundColor: "#302c74",
                        alignItems: "center"
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
                <Typography component={Link} to="" onClick={(event) => {handleLoadList(event, list._id)}} variant="subtitle1" style={{ fontSize: '12pt' }} >Edit</Typography>
            </Box>
                <Box>
                    <IconButton disableRipple={true} disabled={store.isListNameEditActive} onClick={(event) => {
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
        </Card>;
    if(list.isPublished && !isExpanded)
        cardElement =
            <Card
                color={"#d8d4f4"}
                id={list._id}
                key={list._id}
                sx={{ marginRight: '20px', marginLeft: '20px', marginTop: '20px', display: 'flex', p: 1 }}
                disabled={store.isListNameEditActive}
                style={{
                    fontSize: '20pt',
                    borderRadius: 15
                }}
            >
                <Box sx={{ pl: 1, flexGrow: 1 }}>
                    <Typography variant="title" style={{ fontWeight: 'bold', fontSize: '17pt' }} >{list.name}</Typography>
                    <Typography variant="subtitle1" style={{ padding: '10px 0', fontSize: '12pt' }} >By: {list.userName}</Typography>
                    <Typography variant="subtitle1" style={{ fontSize: '12pt' }} >Published: {list.publishedDate}</Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton disabled={store.isListNameEditActive} onClick={(event) => {
                        handleDeleteList(event, list._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton disabled={store.isListNameEditActive} onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
            </Card>;

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + list._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={list.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;
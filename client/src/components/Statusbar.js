import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../auth';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import IconButton from '@mui/material/IconButton';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    function handleCreateNewList() {
        store.createNewList();
    }
    let statusbar = "";
    let text ="";
    if (store.currentList)
        text = store.currentList.name;
    
    if(auth.loggedIn) {
        if(store.homeSelected || store.history.location.state?.data)
            statusbar =
                <div id="top5-statusbar">
                    <IconButton 
                        sx={{ m: 1 , mb: 2 }}
                        size="small"
                        edge="end"
                        color="inherit"
                        disabled={store.currentList !== null}
                        onClick={handleCreateNewList}>
                        <AddOutlinedIcon style={{ fontSize: 45 }} />
                    </IconButton>
                    <Typography style={{ fontSize: 35}} color={store.currentList !== null ? '#989494' : 'black'}>Your Lists</Typography>
                </div>;
        else if(store.allListsSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>{store.searchBarText !== "" && store.lists.length !== 0 ? store.searchBarText+" Lists" : "All Lists"}</Typography>
                </div>;
        else if(store.usersSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>{store.searchBarText !== ""  && store.lists.length !== 0 ? store.searchBarText+" Lists" : "Users Lists"}</Typography>
                </div>;
        else if(store.communityListsSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>Community Lists</Typography>
                </div>;
    }
    else if(auth.loggedInAsGuest) {
        if(store.allListsSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>{store.searchBarText !== "" && store.lists.length !== 0 ? store.searchBarText+" Lists" : "All Lists"}</Typography>
                </div>;
        else if(store.usersSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>{store.searchBarText !== ""  && store.lists.length !== 0 ? store.searchBarText+" Lists" : "Users Lists"}</Typography>
                </div>;
        else if(store.communityListsSelected)
            statusbar =
                <div id="top5-statusbar">
                    <Typography style={{ fontSize: 35}}>Community Lists</Typography>
                </div>;
    }
    return (
        statusbar
    );
}

export default Statusbar;
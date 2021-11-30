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
    if(auth.loggedIn) {
        let text ="";
        if (store.currentList)
            text = store.currentList.name;
        return (
            <div id="top5-statusbar">
                <IconButton 
                    sx={{ m: 1 , mb: 2 }}
                    size="small"
                    edge="end"
                    color="inherit"
                    disabled={store.currentList != null}
                    onClick={handleCreateNewList}>
                    <AddOutlinedIcon style={{ fontSize: 60 }} />
                </IconButton>
                <Typography color={store.currentList != null ? '#989494' : 'black'} variant="h2">Your Lists</Typography>
                <Typography variant="h4">{text}</Typography>
            </div>
        );
    }
    else if(auth.loggedInAsGuest) {
        let text ="";
        if (store.currentList)
            text = store.currentList.name;
        return (
            <div id="top5-statusbar">
                <Typography variant="h4">{text}</Typography>
            </div>
        );
    }
    else return null;
}

export default Statusbar;
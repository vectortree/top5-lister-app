import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../auth'

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
    if(auth.loggedIn || auth.loggedInAsGuest) {
        let text ="";
        if (store.currentList)
            text = store.currentList.name;
        return (
            <div id="top5-statusbar">
                <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                disabled={store.isListNameEditActive}
                onClick={handleCreateNewList}>
                    <AddIcon />
                </Fab>
                <Typography variant="h2">Your Lists</Typography>
                <Typography variant="h4">{text}</Typography>
            </div>
        );
    }
    else return null;
}

export default Statusbar;
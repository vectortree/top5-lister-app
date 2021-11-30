import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
import DeleteListModal from "../components/DeleteListModal"

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_NOT_ACTIVE: "SET_LIST_NAME_EDIT_NOT_ACTIVE",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_ITEM_EDIT_NOT_ACTIVE: "SET_ITEM_EDIT_NOT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        lists: [],
        filteredLists : [],
        searchBarText: "",
        currentList: null,
        newListCounter: 0,
        isListNameEditActive: false,
        isItemEditActive: false,
        listMarkedForDeletion: null,
        undoButtonEnabled: false,
        redoButtonEnabled: false,
        closeButtonEnabled: false,
        addListButtonEnabled: true,
        homeSelected: false,
        allListsSelected: false,
        usersSelected: false,
        communityListsSelected: false
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    lists: payload.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: true,
                    addListButtonEnabled: true
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: payload.undo,
                    redoButtonEnabled: payload.redo,
                    closeButtonEnabled: true,
                    addListButtonEnabled: true
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                    
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: false
                });
            }
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_NOT_ACTIVE: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: false,
                    redoButtonEnabled: false,
                    closeButtonEnabled: false,
                    addListButtonEnabled: true
                });
            }
            case GlobalStoreActionType.SET_ITEM_EDIT_NOT_ACTIVE: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    undoButtonEnabled: payload.undo,
                    redoButtonEnabled: payload.redo,
                    closeButtonEnabled: true,
                    addListButtonEnabled: true
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getAllLists(top5List) {
                        response = await api.getAllTop5Lists();
                        if (response.data.success) {
                            let top5Lists = response.data.top5Lists;
                            let lists = [];
                            for (let key in top5Lists) {
                                let list = top5Lists[key];
                                if(auth.user.email === list.ownerEmail) {
                                    let info = {
                                        _id: list._id,
                                        name: list.name,
                                        items: list.items,
                                        ownerEmail: list.ownerEmail,
                                        userName: list.userName,
                                        numberOfLikes: list.numberOfLikes,
                                        numberOfDislikes: list.numberOfDislikes,
                                        publishedDate: list.publishedDate,
                                        comments: list.comments,
                                        isPublished: list.isPublished
                                        
                                    };
                                    lists.push(info);
                                }
                            }
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: lists
                            });
                        }
                    }
                    getAllLists(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let newDate = new Date().toString();
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            userName: auth.user.userName,
            ownerEmail: auth.user.email,
            numberOfLikes: 0,
            numberOfDislikes: 0,
            publishedDate: newDate,
            comments: [],
            isPublished: false
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadLists = async function () {
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            let lists = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(auth.user.email === list.ownerEmail) {
                    let info = {
                        _id: list._id,
                        name: list.name,
                        items: list.items,
                        ownerEmail: list.ownerEmail,
                        userName: list.userName,
                        numberOfLikes: list.numberOfLikes,
                        numberOfDislikes: list.numberOfDislikes,
                        publishedDate: list.publishedDate,
                        comments: list.comments,
                        isPublished: list.isPublished
                        
                    };
                    lists.push(info);
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: lists
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadLists();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: top5List,
                        undo: false,
                        redo: false
                    }
                });
                history.push("/top5list/" + top5List._id, { data: top5List._id });
            }
        }
    }

    store.addMoveItemTransaction = function (start, end) {
        if(start != end) {
            let transaction = new MoveItem_Transaction(store, start, end);
            tps.addTransaction(transaction);
        }
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            let undoButton = true;
            let redoButton = true;
            if(!tps.hasTransactionToUndo()) undoButton = false;
            if(!tps.hasTransactionToRedo()) redoButton = false;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {
                    currentList: store.currentList,
                    undo: undoButton,
                    redo: redoButton
                }
            });
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    store.setListNameEditNotActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_NOT_ACTIVE,
            payload: null
        });
    }
    store.setItemNameEditNotActive = function () {
        let undoButton = true;
        let redoButton = true;
        if(!tps.hasTransactionToUndo()) undoButton = false;
        if(!tps.hasTransactionToRedo()) redoButton = false;
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_NOT_ACTIVE,
            payload: {
                undo: undoButton,
                redo: redoButton
            }
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            <DeleteListModal
            listMarkedForDeletion={store.listMarkedForDeletion}
            deleteMarkedListCallback={store.deleteMarkedList}
            unmarkListForDeletionCallback={store.unmarkListForDeletion}>
            </DeleteListModal>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
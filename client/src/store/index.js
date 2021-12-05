import { createContext, useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
    LOAD_ALL_LISTS: "LOAD_ALL_LISTS",
    LOAD_USER_LISTS: "LOAD_USER_LISTS",
    LOAD_COMMUNITY_LISTS: "LOAD_COMMUNITY_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    UPDATE_LIST: "UPDATE_LIST",
    SEARCH_BAR: "SEARCH_BAR",
    UPDATE_COMMUNITY_LIST: "UPDATE_COMMUNITY_LIST",
    UPDATE_COMMUNITY_LIST_INFO: "UPDATE_COMMUNITY_LIST_INFO",
    SORT_LISTS: "SORT_LISTS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        lists: [],
        listsCopy : [],
        searchBarText: "",
        currentList: null,
        newListCounter: 0,
        listMarkedForDeletion: null,
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
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload.currentList,
                    newListCounter: payload.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                })
            }
            // GET HOME LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    searchBarText: "",
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: true,
                    allListsSelected: false,
                    usersSelected: false,
                    communityListsSelected: false
                });
            }
            // GET ALL LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ALL_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    searchBarText: "",
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: false,
                    allListsSelected: true,
                    usersSelected: false,
                    communityListsSelected: false
                });
            }
            // GET USER LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_USER_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    searchBarText: "",
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: false,
                    allListsSelected: false,
                    usersSelected: true,
                    communityListsSelected: false
                });
            }
            // GET COMMUNITY LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_COMMUNITY_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    searchBarText: "",
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: false,
                    allListsSelected: false,
                    usersSelected: false,
                    communityListsSelected: true
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: payload,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            // UPDATE CURRENT LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            case GlobalStoreActionType.SORT_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    searchBarText: store.searchBarText,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            // UPDATE LIST
            case GlobalStoreActionType.UPDATE_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    homeSelected: store.homeSelected,
                    allListsSelected: store.allListsSelected,
                    usersSelected: store.usersSelected,
                    communityListsSelected: store.communityListsSelected
                });
            }
            case GlobalStoreActionType.UPDATE_COMMUNITY_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    homeSelected: true,
                    allListsSelected: false,
                    usersSelected: false,
                    communityListsSelected: false
                });
            }
            case GlobalStoreActionType.UPDATE_COMMUNITY_LIST_INFO: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    homeSelected: false,
                    allListsSelected: false,
                    usersSelected: false,
                    communityListsSelected: true
                });
            }
            
            case GlobalStoreActionType.SEARCH_BAR: {
                return setStore({
                    lists: payload.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    addListButtonEnabled: true,
                    searchBarText: payload.searchBarText,
                    homeSelected: payload.homeSelected,
                    allListsSelected: payload.allListsSelected,
                    usersSelected: payload.usersSelected,
                    communityListsSelected: payload.communityListsSelected,
                    addListButtonEnabled: payload.addListButtonEnabled
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
                                        isPublished: list.isPublished,
                                        numberOfViews: list.numberOfViews,
                                        userLikes: list.userLikes,
                                        userDislikes: list.userDislikes
                                        
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
            isPublished: false,
            numberOfViews: 0,
            userLikes: [],
            userDislikes: []
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                    currentList: newList,
                    newListCounter: store.newListCounter + 1
                }
            });

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id, { data: newList });
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.createNewCommunityList = async function (list) {
        let newDate = new Date().toString();
        let pairs = [];
        let pair1 = {
            key: list.items[0],
            value: 5
        };
        let pair2 = {
            key: list.items[1],
            value: 4
        };
        let pair3 = {
            key: list.items[2],
            value: 3
        };
        let pair4 = {
            key: list.items[3],
            value: 2
        };
        let pair5 = {
            key: list.items[4],
            value: 1
        };
        pairs.push(pair1);
        pairs.push(pair2);
        pairs.push(pair3);
        pairs.push(pair4);
        pairs.push(pair5);
        let payload = {
            name: list.name,
            items: list.items,
            updatedDate: newDate,
            numberOfLikes: 0,
            numberOfDislikes: 0,
            comments: [],
            numberOfViews: 0,
            userLikes: [],
            userDislikes: [],
            itemPointPairs: pairs
        };
        const response = await api.createCommunityList(payload);
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.publishedDate);
                let keyY = new Date(y.publishedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: sortedLists
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.getSortedLists = function () {
        let sortedLists = store.lists;
        if(store.communityListSelected) {
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.updatedDate);
                let keyY = new Date(y.updatedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
        }
        else {
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.publishedDate);
                let keyY = new Date(y.publishedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
        }
        return sortedLists
    }

    store.sortByPublishDateNewest = function() {
        let sortedLists = store.lists;
        sortedLists.sort(function(x, y) {
            let keyX = new Date(x.publishedDate);
            let keyY = new Date(y.publishedDate);
            if (keyX < keyY) return 1;
            if (keyX > keyY) return -1;
            return 0;
        });
        if(store.homeSelected) {
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
        }
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
    }
    

    store.sortByPublishDateOldest = function() {
        let sortedLists = store.getSortedLists();
        sortedLists.sort(function(x, y) {
            let keyX = new Date(x.publishedDate);
            let keyY = new Date(y.publishedDate);
            if (keyX < keyY) return -1;
            if (keyX > keyY) return 1;
            return 0;
        });
        if(store.homeSelected) {
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
        }
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
    }

    store.sortByViews = function() {
        let sortedLists = store.getSortedLists();
        sortedLists.sort(function(x, y) {
            let keyX = x.numberOfViews;
            let keyY = y.numberOfViews;
            if (keyX < keyY) return 1;
            if (keyX > keyY) return -1;
            return 0;
        });
        if(store.homeSelected) {
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
        }
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
    }

    store.sortByLikes = function() {
        let sortedLists = store.getSortedLists();
        sortedLists.sort(function(x, y) {
            let keyX = x.numberOfLikes;
            let keyY = y.numberOfLikes;
            if (keyX < keyY) return 1;
            if (keyX > keyY) return -1;
            return 0;
        });
        if(store.homeSelected) {
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
        }
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
        
    }

    store.sortByDislikes = function() {
        let sortedLists = store.getSortedLists();
        sortedLists.sort(function(x, y) {
            let keyX = x.numberOfDislikes;
            let keyY = y.numberOfDislikes;
            if (keyX < keyY) return 1;
            if (keyX > keyY) return -1;
            return 0;
        });
        if(store.homeSelected) {
            let sortedListsFiltered = sortedLists;
            sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
            sortedLists = sortedLists.filter(x => x.isPublished);
            sortedLists = sortedLists.concat(sortedListsFiltered);
        }
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
        
    }

    store.sortByUpdateDateNewest = function() {
        let sortedLists = store.lists;
        sortedLists.sort(function(x, y) {
            let keyX = new Date(x.updatedDate);
            let keyY = new Date(y.updatedDate);
            if (keyX < keyY) return 1;
            if (keyX > keyY) return -1;
            return 0;
        });
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
        
    }

    store.sortByUpdateDateOldest = function() {
        let sortedLists = store.getSortedLists();
        sortedLists.sort(function(x, y) {
            let keyX = new Date(x.updatedDate);
            let keyY = new Date(y.updatedDate);
            if (keyX < keyY) return -1;
            if (keyX > keyY) return 1;
            return 0;
        });
        storeReducer({
            type: GlobalStoreActionType.SORT_LISTS,
            payload: sortedLists
        });
        
    }

    store.loadAllLists = async function () {
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            let lists = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(list.isPublished && list.name === "") {
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.publishedDate);
                let keyY = new Date(y.publishedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_LISTS,
                payload: sortedLists
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }
    store.loadUserLists = async function () {
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            let lists = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(list.isPublished && list.userName === "") {
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.publishedDate);
                let keyY = new Date(y.publishedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_LISTS,
                payload: sortedLists
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.loadCommunityLists = async function () {
        const response = await api.getAllCommunityLists();
        if (response.data.success) {
            let communityLists = response.data.communityLists;
            let lists = [];
            for (let key in communityLists) {
                let list = communityLists[key];
                let info = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    updatedDate: list.updatedDate,
                    numberOfLikes: list.numberOfLikes,
                    numberOfDislikes: list.numberOfDislikes,
                    comments: list.comments,
                    numberOfViews: list.numberOfViews,
                    userLikes: list.userLikes,
                    userDislikes: list.userDislikes,
                    itemPointPairs: list.itemPointPairs
                    
                };
                lists.push(info);
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.updatedDate);
                let keyY = new Date(y.updatedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            storeReducer({
                type: GlobalStoreActionType.LOAD_COMMUNITY_LISTS,
                payload: sortedLists
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

    store.deleteCommunityList = async function (listToDelete) {
        // Get community list with the same name (case insensitive)
        // Update itemPointPairs by decreasing points of items in listToDelete
        // Delete all items in itemPointPairs with 0 points
        // If itemPointPairs is empty, delete community list
        // Else, sort the itemPointPairs according to points in decreasing order and update items (i.e., length 5)
        // based on the first five elements in itemPointPairs
        const response = await api.getAllCommunityLists();
            if (response.data.success) {
                let communityList = null;
                let communityLists = response.data.communityLists;
                for (let key in communityLists) {
                    let lst = communityLists[key];
                    if(lst.name.localeCompare(listToDelete.name, undefined, {sensitivity: 'accent'})===0) {
                        communityList = lst;
                    }
                }
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < communityList.itemPointPairs.length; j++) {
                        if(communityList.itemPointPairs[j].key.localeCompare(listToDelete.items[i], undefined, {sensitivity: 'accent'})===0) {
                            communityList.itemPointPairs[j].value -= 5-i;
                        }
                    }
                }
                communityList.itemPointPairs = communityList.itemPointPairs.filter(x => x.value != 0);
                if(communityList.itemPointPairs.length == 0)
                    await api.deleteCommunityListById(communityList._id);
                else {
                    let newDate = new Date().toString();
                    communityList.updatedDate = newDate;
                    communityList.itemPointPairs.sort(function(x, y) {
                        let keyX = x.value;
                        let keyY = y.value;
                        if (keyX < keyY) return 1;
                        if (keyX > keyY) return -1;
                        return 0;
                    });
                    communityList.items = [];
                    for(let i = 0; i < 5; i++) {
                        communityList.items.push(communityList.itemPointPairs[i].key);
                    }
                    const response = await api.updateCommunityListById(communityList._id, communityList);
                }
            }
    }

    store.deleteMarkedList = function () {
        if(store.listMarkedForDeletion.isPublished)
            store.deleteCommunityList(store.listMarkedForDeletion);
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
                    }
                });
                history.push("/top5list/" + top5List._id, { data: top5List });
            }
        }
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        history.push('/');
    }

    store.updateList = async function (list) {
        const response = await api.updateTop5ListById(list._id, list);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_LIST,
                payload: null
            });
        }
    }

    store.updateCommunityList = async function (list) {
        // Check if community list with same name (case insensitive) already exists
        // If it doesn't, then create new community list
        // Else, update community list with new updated date, itemPointPairs, and items
        // Remember to first update itemPointPairs (if item doesn't exist, add it along with its points)
        // Next, sort itemPointPairs based on points and update items (which always has length 5) based
        // on the first 5 elements in itemPointPairs
        const response = await api.getAllCommunityLists();
        if (response.data.success) {
            let communityList = null;
            let communityLists = response.data.communityLists;
            for (let key in communityLists) {
                let lst = communityLists[key];
                if(lst.name.localeCompare(list.name, undefined, {sensitivity: 'accent'})===0) {
                    communityList = lst;
                }
            }
            if(communityList === null) {
                store.createNewCommunityList(list);
            }
            else {
                let itemFlag = [false, false, false, false, false];
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < communityList.itemPointPairs.length; j++) {
                        if(communityList.itemPointPairs[j].key.localeCompare(list.items[i], undefined, {sensitivity: 'accent'})===0) {
                            communityList.itemPointPairs[j].value += 5-i;
                            itemFlag[i] = true;
                        }

                    }
                }
                for(let i = 0; i < 5; i++) {
                    if(!itemFlag[i]) {
                        let pair = {
                            key: list.items[i],
                            value: 5-i
                        };
                        communityList.itemPointPairs.push(pair);
                    }
                }
                let newDate = new Date().toString();
                communityList.updatedDate = newDate;
                communityList.itemPointPairs.sort(function(x, y) {
                    let keyX = x.value;
                    let keyY = y.value;
                    if (keyX < keyY) return 1;
                    if (keyX > keyY) return -1;
                    return 0;
                });
                communityList.items = [];
                for(let i = 0; i < 5; i++) {
                    communityList.items.push(communityList.itemPointPairs[i].key);
                }
                const response = await api.updateCommunityListById(communityList._id, communityList);
            }
        }
    }

    store.updateCommunityListInfo = async function (communityList) {
        const response = await api.updateCommunityListById(communityList._id, communityList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_COMMUNITY_LIST_INFO,
                payload: null
            });
        }
    }

    store.homeSearchBar = async function (searchText) {
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.publishedDate);
                let keyY = new Date(y.publishedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            if(store.homeSelected) {
                let sortedListsFiltered = lists;
                sortedListsFiltered = sortedListsFiltered.filter(x => !x.isPublished);
                sortedLists = sortedLists.filter(x => x.isPublished);
                sortedLists = sortedLists.concat(sortedListsFiltered);
            }
            let lsts = sortedLists.filter(x => x.name.toUpperCase().startsWith(searchText.toUpperCase()));
            storeReducer({
                type: GlobalStoreActionType.SEARCH_BAR,
                payload: {
                    lists: lsts,
                    searchBarText: searchText,
                    homeSelected: true,
                    usersSelected: false,
                    allListsSelected: false,
                    communityListSelected: false
                }
            });
        }
    }

    store.allListsSearchBar = async function (searchText) {
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            let lists = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(list.isPublished && list.name.localeCompare(searchText, undefined, {sensitivity: 'accent'})===0) {
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            storeReducer({
                type: GlobalStoreActionType.SEARCH_BAR,
                payload: {
                    lists: lists,
                    searchBarText: searchText,
                    homeSelected: false,
                    usersSelected: false,
                    allListsSelected: true,
                    communityListSelected: false
                }
            });
        }
    }
    store.usersSearchBar = async function (searchText) {
        const response = await api.getAllTop5Lists();
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            let lists = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(list.isPublished && list.userName.localeCompare(searchText, undefined, {sensitivity: 'accent'})===0) {
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
                        isPublished: list.isPublished,
                        numberOfViews: list.numberOfViews,
                        userLikes: list.userLikes,
                        userDislikes: list.userDislikes
                        
                    };
                    lists.push(info);
                }
            }
            storeReducer({
                type: GlobalStoreActionType.SEARCH_BAR,
                payload: {
                    lists: lists,
                    searchBarText: searchText,
                    homeSelected: false,
                    usersSelected: true,
                    allListsSelected: false,
                    communityListSelected: false
                }
            });
        }
    }

    store.communityListsSearchBar = async function (searchText) {
        const response = await api.getAllCommunityLists();
        if (response.data.success) {
            let communityLists = response.data.communityLists;
            let lists = [];
            for (let key in communityLists) {
                let list = communityLists[key];
                let info = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    updatedDate: list.updatedDate,
                    numberOfLikes: list.numberOfLikes,
                    numberOfDislikes: list.numberOfDislikes,
                    comments: list.comments,
                    numberOfViews: list.numberOfViews,
                    userLikes: list.userLikes,
                    userDislikes: list.userDislikes,
                    itemPointPairs: list.itemPointPairs
                    
                };
                lists.push(info);
            }
            let sortedLists = lists;
            sortedLists.sort(function(x, y) {
                let keyX = new Date(x.updatedDate);
                let keyY = new Date(y.updatedDate);
                if (keyX < keyY) return 1;
                if (keyX > keyY) return -1;
                return 0;
            });
            let lsts = sortedLists.filter(x => x.name.toUpperCase().startsWith(searchText.toUpperCase()));
            storeReducer({
                type: GlobalStoreActionType.SEARCH_BAR,
                payload: {
                    lists: lsts,
                    searchBarText: searchText,
                    homeSelected: false,
                    usersSelected: false,
                    allListsSelected: false,
                    communityListsSelected: true
                }
            });
        }
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
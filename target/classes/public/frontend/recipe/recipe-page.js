/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

//const BASE_URL = "http://localhost:8081"; // backend URL

const BASE_URL = "https://8081-hipsterindi-hipsterindi-btlziuavoza.ws-us121.gitpod.io"; // test


let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * DONE: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   
    //Recipe name & instructions fields:
    addNameInput = document.getElementById("add-recipe-name-input");
    addInstructionsInput = document.getElementById("add-recipe-instructions-input");
    addButton = document.getElementById("add-recipe-submit-input");

    updateNameInput = document.getElementById("update-recipe-name-input");
    updateInstructionsInput = document.getElementById("update-recipe-instructions-input");
    updateButton = document.getElementById("update-recipe-submit-input");

    deleteNameInput = document.getElementById("delete-recipe-name-input");
    deleteButton = document.getElementById("delete-recipe-submit-input");

    //Recipe list container:
    listRecipe = document.getElementById("recipe-list");

    //Admin link & logout button:
    adminLink = document.getElementById("admin-link");
    logoutButton = document.getElementById("logout-button");
   
    //Recipe Search:
    searchInput = document.getElementById("search-input");
    searchButton = document.getElementById("search-button");


    /*
     * DONE: Show logout button if auth-token exists in sessionStorage
     */

    if(sessionStorage.getItem("auth-token")){
        logoutButton.hidden= false;
    }
    else{
        logoutButton.hidden= true;
    }

    /*
     * DONE: Show admin link if is-admin flag in sessionStorage is "true"
     */

    displayAdminLink();




    /*
     * DONE: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    
    addButton.onclick = addRecipe;
    updateButton.onclick = updateRecipe;
    deleteButton = deleteRecipe;
    searchButton = searchRecipes;
    logoutButton.onclick = processLogout;

    /*
     * DONE: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        var name = searchInput.value;
        
        const queryParam = new URLSearchParams({name:name});

        const requestOptions = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")

            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };

        try{
            const searchResponse = await fetch(`${BASE_URL}/recipes?${queryParam}`);  //search for recipe by name

            //todo... stuff



            //refresh list
            refreshRecipeList();

        }
        catch(error){
            console.log("TO-DO: ",error);
        }

    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
    }

    function displayAdminLink(){
        
        if(sessionStorage.getItem("is-admin")){
            adminLink.hidden= false;

        }
        else{
            adminLink.hidden=true;
        }

    }

    /**
     * DONE: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here

            const tokenBearer = sessionStorage.getItem("auth-token");

            const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": `Bearer ${tokenBearer}`
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };

        try{

            const logoutResponse = await fetch(`${BASE_URL}/logout`, requestOptions);

            //DEBUG
            //console.log("logoutResponse: ", logoutResponse);

            if(logoutResponse.status == 200){
                sessionStorage.clear();
                setTimeout( ()=>{window.location.href=`${BASE_URL}/frontend/login/login-page.html`} ,500);
            }
            else{
                alert("error status: ", logoutResponse.status,"\ntry to logout again!");
            }


        }
        catch(error){

            console.log("error occurred during logout: ", error);
            alert("error! try to logout again: \n", error);
        }

    }

});

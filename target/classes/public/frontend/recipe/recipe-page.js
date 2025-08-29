/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

//const BASE_URL = "http://localhost:8081"; // backend URL

const BASE_URL = "https://8081-hipsterindi-hipsterindi-ornopet9gx5.ws-us121.gitpod.io"; // test


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
    displayLogoutButton();
  


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
    deleteButton.onclick = deleteRecipe;
    searchButton.onclick = searchRecipes;
    logoutButton.onclick = processLogout;

    /*
     * DONE: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * DONE: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {

        //parse html input
        var name = searchInput.value.trim();
        
        //?name=...
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
            //search for recipe by name
            const searchResponse = await fetch(`${BASE_URL}/recipes?${queryParam}`, requestOptions);  

            if(searchResponse.status == 200){
                
                //update the recipes Array
                recipes = [];

                var searchedRecipes = await searchResponse.json();
                
                for(recipe of searchedRecipes){
                    recipes.push( { name:recipe.name, instructions:recipe.instructions} ); //push name + instruct ONLY
                }

                //refresh list
                refreshRecipeList();
            }
            else if(searchResponse.status == 404){
                alert("error! recipes not found!");
            }

        }
        catch(error){
            console.error("ERROR WHEN SEARCHING: ", error);
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
        
        
        //parse html input
        var recipeName = addNameInput.value.trim();
        var recipeInstruct = addInstructionsInput.value.trim();
        
        //Handle input validation
        var errors = [];
        if(recipeName == ''){errors.push("No Recipe Name provided");}
        
        if(recipeInstruct == ''){errors.push("No Recipe Instructions provided");}
        
        if(errors.length>0){
            errors = errors.join("\n");
            alert(errors);
            return;
        }
        
        //Setup fetch request (add recipe/instructions to database)
        const requestBody = { name:recipeName, instructions:recipeInstruct }
        
        const requestOptions = {
            method: "POST",
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
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };
        
        try{
            //add recipe to database
            const addResponse = await fetch(`${BASE_URL}/recipes`, requestOptions);  
            
            //debug            
            //console.log(sessionStorage.getItem("auth-token"));
            
            //debug
            //console.log(addResponse);
            
            //alert(addResponse.json()[0].name);
            
            if(addResponse.status == 201){
                //alert('hi');
                //clear inputs:
                addNameInput.value = "";
                addInstructionsInput.value = "";


                //fetch latest recipes & refresh list:
                getRecipes();

            }

        }
        catch(error){
            console.error("ERROR WHEN ADDING RECIPE: ",error);
        }

    }

    /**
     * DONE: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {

        //parse html input
        var recipeName = updateNameInput.value.trim();
        var recipeInstruct = updateInstructionsInput.value.trim();
        
        /* INPUT VALIDATION */
        var errors = [];
        if(recipeName == ''){errors.push("Cannot Update: No Recipe Name provided");}

        if(recipeInstruct == ''){errors.push("Cannot Update: No Recipe Instructions provided");}

        if(errors.length>0){
            errors = errors.join("\n");
            alert(errors);
            return;
        }

        /* Setup fetch request for recipes by name (GET) */
        const queryParam = new URLSearchParams({name:recipeName}); 
        
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
            const findResponse = await fetch(`${BASE_URL}/recipes/?${queryParam}`, requestOptions);  //search for recipe by name

            //transform response to json
            const foundRecipes = await findResponse.json();

            if(findResponse.status == 200 && foundRecipes.length==1){
                
                //clear inputs:
                updateNameInput.value = "";
                updateInstructionsInput.value = "";

                //retrieve the single recipe
                var singleRecipe = foundRecipes; 

                //setup fetch with PUT method using id of recipe:
                //fetch with URL: `${BASE_URL}/recipes/${ID}`
                const updateRequestOptions = {
                    method: "PUT",
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
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify( { name:recipeName, instructions:recipeInstruct } ) //only update name + instruct
                };

                //send PUT request to update recipe by ID
                const updateResponse = await fetch(`${BASE_URL}/recipes/${singleRecipe[0].id}`, updateRequestOptions);

                //fetch latest recipes & refresh list
                getRecipes();
                
            }
            else if(findResponse.status == 200 && foundRecipes.length>1){
                
                //clear recipes Array
                recipes = [];

                //show the different recipes searched for, to help the user narrow their search
                for(recipe of foundRecipes){
                    recipes.push( { name:recipe.name, instructions:recipe.instructions} ); //push name + instruct ONLY
                }
                
                //refresh list:
                refreshRecipeList();

                alert("Too many results! Please specify which recipe to update.")
            }
            else if(findResponse.status == 404){
                alert("error! recipes not found!");
            }

        }
        catch(error){
            console.error("ERROR WHEN UPDATING RECIPES: ",error);
        }

    }

    /**
     * DONE: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */

    //DELETES can only be performed by an admin user
    async function deleteRecipe() {

        //parse html input
        var recipeName = deleteNameInput.value.trim();
        
        /* INPUT VALIDATION */
        var errors = [];
        if(recipeName == ''){errors.push("Cannot Delete: No Recipe Name provided");}

        if(errors.length>0){
            errors = errors.join("\n");
            alert(errors);
            return;
        }

        /* Setup fetch request for recipes by name (GET) */
        const queryParam = new URLSearchParams({name:recipeName}); 
        
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
            const findResponse = await fetch(`${BASE_URL}/recipes/?${queryParam}`, requestOptions);  //search for recipe by name

            //transform response to json
            const foundRecipes = await findResponse.json();

            if(findResponse.status == 200 && foundRecipes.length==1){
                
                //clear inputs:
                deleteNameInput.value = "";

                //retrieve the single recipe
                var singleRecipe = foundRecipes; 

                //setup fetch with DELETE method using id of recipe:
                //fetch with URL: `${BASE_URL}/recipes/${ID}`
                const deleteRequestOptions = {
                    method: "DELETE",
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

                //send DELETE request to update recipe by ID
                const deleteResponse = await fetch(`${BASE_URL}/recipes/${singleRecipe[0].id}`, deleteRequestOptions);

                if(deleteResponse.status == 401){
                    alert("Unauthorized user! Cannot delete unless you're an admin");
                    
                }

                //fetch latest recipes & refresh list
                getRecipes();
                
            }
            else if(findResponse.status == 200 && foundRecipes.length>1){
                
                //clear recipes Array
                recipes = [];

                //show the different recipes searched for, to help the user narrow their search
                for(recipe of foundRecipes){
                    recipes.push( { name:recipe.name, instructions:recipe.instructions} ); //push name + instruct ONLY
                }
                
                //refresh list:
                refreshRecipeList();

                alert("Too many results! Please specify which recipe to delete.")
            }
            else if(findResponse.status == 404){
                alert("error! recipes not found!");
            }

        }
        catch(error){
            console.error("ERROR WHEN DELETING RECIPES: ",error);
            alert("ERROR WHEN DELETING");
        }


    }

    /**
     * DONE: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {

        //setup fetch request (get all recipes from database)
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
            //get all recipes
            const getResponse = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if(getResponse.status == 200){

                //clear recipes before appending
                recipes = [];

                /* Get list of recipes from response; iterate through and push to recipes Array */
                var gottenRecipes = await getResponse.json();

                for(recipe of gottenRecipes){
                    recipes.push( { name:recipe.name, instructions:recipe.instructions} ); //push name + instruct ONLY
                }
                
                //refresh list:
                refreshRecipeList();
            }
            else{
                alert("error when getting recipes!");
            }

        }
        catch(error){
            console.log("ERROR WHEN GETTING RECIPES: ", error);
        }



    }

    /**
     * DONE: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        
        //clear DOM list
        while(listRecipe.firstChild){
            listRecipe.removeChild(listRecipe.firstChild);
        }

        //create <li> elements of each recipe stored in recipes Array
        for(element of recipes){
            var recipe = document.createElement('li');
            
            recipe.innerHTML = "<b>Name:</b> " + element.name + "&emsp;|&emsp;<b>Instructions:</b> " + element.instructions; 

            //append <li> elements to <ul>
            listRecipe.appendChild(recipe);
        }

        
    }

    function displayAdminLink(){

        if(sessionStorage.getItem("is-admin") === "true"){
            adminLink.style.visibility= "visible";

        }
        else{
            adminLink.style.visibility="hidden";
        }

    }

    function displayLogoutButton(){

        if(sessionStorage.getItem("auth-token")){
            logoutButton.style.visibility= "visible";
        }
        else{
            logoutButton.style.visibility= "hidden";
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

        //setup fetch request (logout user)
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

            
            if(logoutResponse.status == 200){   //successful logout:
                sessionStorage.clear();
                setTimeout( ()=>{window.location.href=`../login/login-page.html`} ,500);
            }
            else{                               //unsuccessful logout:
                alert("error status: ", logoutResponse.status,"\ntry to logout again!");
            }


        }
        catch(error){

            console.error("error occurred during logout: ", error);
            alert("error! try to logout again: \n", error);
        }

    }

});

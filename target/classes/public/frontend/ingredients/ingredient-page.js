/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

//const BASE_URL = "http://localhost:8081"; // backend URL

const BASE_URL = "https://8081-hipsterindi-hipsterindi-ornopet9gx5.ws-us121.gitpod.io"; // test


/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
var addIngredientNameInput = document.getElementById("add-ingredient-name-input");
var addIngredientButton = document.getElementById("add-ingredient-submit-button");
var deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
var deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
var ingredientListContainer = document.getElementById("ingredient-list");

var searchInput = document.getElementById("search-input"); //optional for future use


/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;


/*
 * TODO: Create an array to keep track of ingredients
 */
var ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {

        //parse html input
        var ingredientName = addIngredientNameInput.value.trim();

        //Handle input validation
        var errors = [];
        if(ingredientName == ''){errors.push("No Ingredient Name provided");}

        if(errors.length>0){
            errors = errors.join("\n");
            alert(errors);
            return;
        }

        //Setup fetch request (add ingredient to database)
        const requestBody = { name:ingredientName }

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
            const addResponse = await fetch(`${BASE_URL}/ingredients`, requestOptions);  

            if(addResponse.status == 201){
                //clear inputs:
                addIngredientNameInput.value = "";

                //fetch latest ingredients & refresh list:
                getIngredients();

            }

        }
        catch(error){
            console.error("ERROR WHEN ADDING INGREDIENT: ",error);
        }

}


/**
 * DONE: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    
    //setup fetch request (get all ingredients from database)
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
        const getResponse = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if(getResponse.status == 200){

            //clear ingredients before appending
            ingredients = [];

            /* Get list of ingredients from response; iterate through and push to ingredients Array */
            var gottenIngredients = await getResponse.json();

            for(ingredient of gottenIngredients){
                ingredients.push( { name:ingredient.name } ); //push name ONLY
            }

            //refresh list:
            refreshIngredientList();
        }
        else{
            alert("error when getting ingredients!");
        }

    }
    catch(error){
        console.error("ERROR WHEN GETTING INGREDIENTS: ", error);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
        
    //parse html input
    var ingredientName = deleteIngredientNameInput.value.trim();
    
    /* INPUT VALIDATION */
    var errors = [];
    if(ingredientName == ''){errors.push("Cannot Delete: No Ingredient Name provided");}

    if(errors.length>0){
        errors = errors.join("\n");
        alert(errors);
        return;
    }

    /* Setup fetch request for recipes by 'term' (GET) */
    const queryParam = new URLSearchParams({term:ingredientName}); 
    
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
        const findResponse = await fetch(`${BASE_URL}/ingredients/?${queryParam}`, requestOptions);  //search for ingredient by name

        //transform response to json
        const foundIngredients = await findResponse.json();

        if(findResponse.status == 200 && foundIngredients.length==1){
            
            //clear inputs:
            deleteIngredientNameInput.value = "";

            //retrieve the single ingredient
            var singleIngredient = foundIngredients; 

            //setup fetch with DELETE method using id of recipe:
            //fetch with URL: `${BASE_URL}/ingredients/${ID}`
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
            const deleteResponse = await fetch(`${BASE_URL}/ingredients/${singleIngredient[0].id}`, deleteRequestOptions);

            //fetch latest ingredients & refresh list
            getIngredients();
            
        }
        else if(findResponse.status == 200 && foundIngredients.length>1){
            
            //clear recipes Array
            ingredients = [];

            //show the different ingredients searched for, to help the user narrow their search
            for(ingredient of foundIngredients){
                ingredients.push( { name:ingredient.name } ); //push name ONLY
            }
            
            //refresh list:
            refreshIngredientList();

            alert("Too many results! Please specify which ingredient to delete.")
        }
        else if(findResponse.status == 404){
            alert("error! ingredients not found!");
        }

    }
    catch(error){
        console.error("ERROR WHEN DELETING INGREDIENT: ",error);
    }

}


/**
 * DONE: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    //clear DOM list
    // while(ingredientListContainer.firstChild){
    //     ingredientListContainer.removeChild(ingredientListContainer.firstChild);
    // }
    ingredientListContainer.innerHTML='';

    //create <li> elements of each recipe stored in ingredients Array
    for(element of ingredients){
        var ingredient = document.createElement('li');
        
        ingredient.innerHTML = "<b>Name:</b> " + element.name; 

        //append <li> elements to <ul>
        ingredientListContainer.appendChild(ingredient);
    }
}

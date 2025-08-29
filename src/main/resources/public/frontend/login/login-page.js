/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

//const BASE_URL = "https://8081-hipsterindi-hipsterindi-btlziuavoza.ws-us121.gitpod.io"; // test


/* 
 * DONE: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */

var usernameInput = document.getElementById("login-input");
var passwordInput = document.getElementById("password-input");
var loginButton = document.getElementById("login-button");
var logoutButton = document.getElementById("logout-button");


/* 
 * DONE: Add click event listener to login button
 * - Call processLogin on click
 */
loginButton.onclick = processLogin;

//optional logout button
logoutButton.onclick = processLogout;



/**
 * DONE: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    // DONE: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty

    var errors = [];

    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();

    if(username == ''){errors.push("Username must not be empty.");}
    if(password == ''){errors.push("Password must not be empty");}

    if(errors.length>0){
        errors.join("\n");
        alert(errors);
        return;
    }

    // DONE: Create a requestBody object with username and password

    const requestBody = { username:username, password:password };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    try {
        // DONE: Send POST request to http://localhost:8081/login using fetch with requestOptions

        const loginResponse = await fetch(`${BASE_URL}/login`,requestOptions);

        // DONE: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
        // - Store both in sessionStorage using sessionStorage.setItem()

        //alert("Response from server was: " + loginResponse.status);


        if(loginResponse.status == 200){
            var ResponseString = loginResponse.text();
            var [token, isAdmin] = (await ResponseString).split(' ');
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", isAdmin);
            // TODO: Optionally show the logout button if applicable
    
            logoutButton.hidden = false;
            
            // DONE: Add a small delay (e.g., 500ms) using setTimeout before redirecting
            // - Use window.location.href to redirect to the recipe page
            setTimeout(() => {window.location.href = `${BASE_URL}/frontend/recipe/recipe-page.html`},500);
            
            
        }
        
        // DONE: If response status is 401
        // - Alert the user with "Incorrect login!"
        else if(loginResponse.status == 401){
            alert("Incorrect Login!");
        }
        
        // DONE: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"
        else{
            alert("Unknown issue!");
        }

        
    } catch (error) {
        // DONE: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error("An error occured during login: ", error);
        alert("there was an error... try again!");
    }
    
}


/**
 * OPTIONAL: Logout Function (taken from recipe-page.js)
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
            setTimeout( ()=>{window.location.href=`${BASE_URL}/frontend/login/login-page.html`} ,500);
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


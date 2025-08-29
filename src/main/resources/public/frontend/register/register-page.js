/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

//const BASE_URL = "https://8081-hipsterindi-hipsterindi-btlziuavoza.ws-us121.gitpod.io"; // test


/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
var usernameInput = document.getElementById("username-input");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var repeatPasswordInput = document.getElementById("repeat-password-input");
var registerButton = document.getElementById("register-button");

//optional admin checkbox
var adminCheck = document.getElementById("admin-check");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here

    const errors = []

    //validating all fields are filled
    if(usernameInput.value.trim() === ''){ errors.push("username must have a value!"); }
    if(emailInput.value.trim() === ''){ errors.push("email must have a value!"); }
    if(passwordInput.value.trim() === ''){ errors.push("password must have a value!"); }
    if(repeatPasswordInput.value.trim() === ''){ errors.push("repeated password must have a value!"); }
    
    //check password and repeat password match
    if(passwordInput.value !== repeatPasswordInput.value){ errors.push("password and repeated password do not match!") }

    //if any validations fail, do not continue with registering, and send an alert to the user.
    if(errors.length > 0){
        alert(errors.join('\n'));
        return;
    }


    try {

        // //debug
        // console.log("value:",adminCheck.checked);  

        // Example placeholder:
        const registerBody = {username: usernameInput.value.trim(), email: emailInput.value.trim(), password: passwordInput.value.trim(), admin: adminCheck.checked};

        // //debug
        // console.log("registerBody:", registerBody);

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
            body: JSON.stringify(registerBody)
        };


        /* 
        * - If status is 201:
        *      - Redirect user to login page
        * - If status is 409:
        *      - Alert that user/email already exists (in the backend, we only check if the username is taken when registering...)
        * - Otherwise:
        *      - Alert generic registration error 
        */
        const initResponse = await fetch(`${BASE_URL}/register`, requestOptions);

        // //debug
        // console.log("registration response:", initResponse);

        //if the validRegistrationTest() fails, go to the PORTS tab, and set 8081 to be made public
        if(initResponse.status == 201){ 
            window.location.href = `${BASE_URL}/frontend/login/login-page.html`;    
        }
        else if(initResponse.status == 409){


            alert("user/email already exists...", await initResponse.text());
        }
        else{
            alert("generic registration error", await initResponse.json());
            console.error("generic registration error", await initResponse.json());
        }
    } catch (error){

        console.error("An error occured during registration", error);   //for dev
        alert("Registration failed due to an error. Try again");        //for user

    }

}

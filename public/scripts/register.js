const submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");

// Register form
const registerEventHandler = async () =>{
    event.preventDefault();
    const usernameValue = username.value;
    const passwordValue = password.value;
    const url = 'http://localhost:3000/register'; 
    const data = JSON.stringify({ "username": `${usernameValue}`, "password": `${passwordValue}` });
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'application/json'
            }
        });
        if(response.redirected){
            window.location.href = response.url;
        };
    } catch(err) {
        console.log(err);
    };
};

submit.addEventListener('click', registerEventHandler);
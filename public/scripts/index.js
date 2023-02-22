// Caption Forms
const caption1 = document.getElementById("caption1");
const caption2 = document.getElementById("caption2");
const caption3 = document.getElementById("caption3");
// Buttons
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");


const eventHandler1 = async () =>{
    event.preventDefault();
    const caption1Value = caption1.value;
    const url = 'http://localhost:3000/';
    const data = JSON.stringify({ "caption": `${caption1Value}`, "image_id": 1 }); 
    try {
        const response = await fetch(url, { 
            method: 'POST',
            body: data, 
            headers: {
            'Content-type': 'application/json',
            }
          });
            if(response.ok){
            const jsonResponse = await response.json();
            console.log(jsonResponse);
        }
      } catch (error) {
        console.log(error);
      }
};

const eventHandler2 = async () =>{
    event.preventDefault();
    const caption2Value = caption2.value;
    const url = 'http://localhost:3000/';
    const data = JSON.stringify({ "caption": `${caption2Value}`, "image_id": 2 }); 
    try {
        const response = await fetch(url, { 
            method: 'POST',
            body: data, 
            headers: {
            'Content-type': 'application/json',
            }
          });
            if(response.ok){
            const jsonResponse = await response.json();
            console.log(jsonResponse);
        }
      } catch (error) {
        console.log(error);
      }
};

const eventHandler3 = async () =>{
    event.preventDefault();
    const caption3Value = caption3.value;
    const url = 'http://localhost:3000/';
    const data = JSON.stringify({ "caption": `${caption3Value}`, "image_id": 3 }); 
    try {
        const response = await fetch(url, { 
            method: 'POST',
            body: data, 
            headers: {
            'Content-type': 'application/json',
            }
          });
            if(response.ok){
            const jsonResponse = await response.json();
            console.log(jsonResponse);
        }
      } catch (error) {
        console.log(error);
      }
};


button1.addEventListener("click", eventHandler1);
  
button2.addEventListener("click", eventHandler2);
  
button3.addEventListener("click", eventHandler3);
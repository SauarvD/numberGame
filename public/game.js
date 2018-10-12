var color="";
var username = ""
const writeEvent = (text) =>{
  const parent = document.querySelector("#events");
  const el = document.createElement("li");
  el.innerHTML = text;

  parent.appendChild(el)
}

const countDivs = () =>{
  var count = 0;
  for(var i=1; i<= 30; i++){
    var valid = document.getElementById("blocks"+i).querySelector(".copyright");
    if(valid !== null){
      count++;
    }
  }
  if(count === 29){
    alert(username + ' has won');
  }
}

const colorDiv = (id,name)=>{
  const parent = document.querySelector("#"+id);
  const el = document.createElement("div");
  el.className = "copyright";
  el.innerHTML = name.playerId;
  username = name.playerId;
  parent.appendChild(el);
  document.getElementById(id).style.backgroundColor = "green";
  countDivs();
}

const onFormSubmit = (e) =>{
  e.preventDefault();
  // const input = document.querySelector("#chat");
  // const text = input.value;
  // input.value = "";
  // console.log(text)
  var idNum = e.target.id.split("s");
  idNum = parseInt(idNum[1]);
  if((document.getElementById("blocks"+ (idNum - 1)) !== null)){
    var element = document.getElementById("blocks"+ (idNum - 1)).querySelector(".copyright");
    if(element === null){
      alert('You have to select previous number as well');
    } else {
      if(username !== ""){
        socket.emit('clickDiv',e.target.id);
        document.getElementById(e.target.id).style.backgroundColor = "green";
      } else {
        alert('Name is required');
      }
    }
  } else {
    if(username !== ""){
      socket.emit('clickDiv',e.target.id);
      document.getElementById(e.target.id).style.backgroundColor = "green";
    } else {
      alert('Name is required');
    }
  }
}

const makeDivs = (data) =>{
  for(var i = 1; i <= data; i++) {
    const parent = document.querySelector("#events");
    var divBlock = document.createElement("div");   
    divBlock.innerHTML += i;             
    divBlock.className = "blocks";
    divBlock.id = "blocks"+i;
    parent.appendChild(divBlock);
    document.querySelector("#blocks"+i).addEventListener('click', onFormSubmit)       
   }
}

const submitName = (e) =>{
  e.preventDefault();
  const name = document.querySelector("#nameData").value;
  document.querySelector("#nameData").value = "";
  if(username === ""){
    if(e.length > 10){
      alert("Please use a short hand name");
    } else {
      socket.emit('name',name);
      username = name;
    }
  } else {
    alert("You are already in the game");
  }
}

makeDivs(30);

const socket = io();
socket.on('colorDiv',colorDiv);
socket.on('onLoad', function(id){
  console.log(id);
})

socket.on('nameSubmitted', function(name){
  const parent = document.querySelector("#nameHolder");
  const el = document.createElement('div');
  el.className = "userName";
  el.innerHTML = name.playerId + ' joined';
  parent.appendChild(el);
  document.getElementById("nameHolder").style.visibility = "visible";
})

document.querySelector("#submit").addEventListener('click', submitName)
document.querySelector("#submitForm").addEventListener('submit', submitName)

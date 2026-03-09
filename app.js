let data = JSON.parse(localStorage.getItem("notesData")) || {
folders:[
{
name:"General",
pages:[
{title:"My First Page",content:"",date:""}
]
}
]
};

let currentFolder=0;
let currentPage=0;

const editor=document.getElementById("editor");
const foldersDiv=document.getElementById("folders");


function save(){

let page=data.folders[currentFolder].pages[currentPage];

page.content=editor.innerHTML;
page.date=new Date().toLocaleString();

localStorage.setItem("notesData",JSON.stringify(data));

updateInfo();

}

editor.addEventListener("input",save);


function load(){

foldersDiv.innerHTML="";

data.folders.forEach((folder,fi)=>{

let f=document.createElement("div");
f.className="folder";
f.textContent=folder.name;

foldersDiv.appendChild(f);

folder.pages.forEach((p,pi)=>{

let div=document.createElement("div");

div.className="page";
div.textContent=p.title;

div.onclick=()=>{

currentFolder=fi;
currentPage=pi;

editor.innerHTML=p.content;

updateInfo();

};

foldersDiv.appendChild(div);

});

});

}


document.getElementById("newFolder").onclick=()=>{

let name=prompt("Folder name");

if(!name)return;

data.folders.push({name:name,pages:[]});

saveData();

load();

};


document.getElementById("newPage").onclick=()=>{

let name=prompt("Page name");

if(!name)return;

data.folders[currentFolder].pages.push({
title:name,
content:"",
date:""
});

saveData();

load();

};


document.getElementById("renamePage").onclick=()=>{

let name=prompt("New name");

if(!name)return;

data.folders[currentFolder].pages[currentPage].title=name;

saveData();

load();

};


document.getElementById("deletePage").onclick=()=>{

if(!confirm("Delete page?"))return;

data.folders[currentFolder].pages.splice(currentPage,1);

if(data.folders[currentFolder].pages.length===0){

data.folders[currentFolder].pages.push({
title:"Empty",
content:"",
date:""
});

}

currentPage=0;

editor.innerHTML=data.folders[currentFolder].pages[0].content;

saveData();

load();

};


function format(cmd){

document.execCommand(cmd,false,null);

}


function uploadImage(){

let input=document.createElement("input");

input.type="file";
input.accept="image/*";

input.onchange=function(){

let reader=new FileReader();

reader.onload=function(e){

document.execCommand("insertImage",false,e.target.result);

};

reader.readAsDataURL(input.files[0]);

};

input.click();

}


/* Drag Drop Image */

editor.addEventListener("dragover",e=>{

e.preventDefault();

});

editor.addEventListener("drop",e=>{

e.preventDefault();

let file=e.dataTransfer.files[0];

if(file && file.type.startsWith("image")){

let reader=new FileReader();

reader.onload=function(ev){

document.execCommand("insertImage",false,ev.target.result);

};

reader.readAsDataURL(file);

}

});


function updateInfo(){

let words=editor.innerText.trim().split(/\s+/).length;

if(editor.innerText==="")words=0;

document.getElementById("wordCount").innerText="Words: "+words;

document.getElementById("lastEdit").innerText="Last edit: "+data.folders[currentFolder].pages[currentPage].date;

}


function saveData(){

localStorage.setItem("notesData",JSON.stringify(data));

}


/* Search */

document.getElementById("search").oninput=e=>{

let q=e.target.value.toLowerCase();

document.querySelectorAll(".page").forEach(p=>{

p.style.display=p.textContent.toLowerCase().includes(q)?"block":"none";

});

};


/* Dark mode */

document.getElementById("darkToggle").onclick=()=>{

document.body.classList.toggle("dark");

};


/* Backup */

document.getElementById("backup").onclick=()=>{

let blob=new Blob([JSON.stringify(data)]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="notes_backup.json";

a.click();

};


/* Restore */

document.getElementById("restore").onclick=()=>{

let input=document.createElement("input");

input.type="file";

input.onchange=function(){

let reader=new FileReader();

reader.onload=function(e){

data=JSON.parse(e.target.result);

saveData();

load();

};

reader.readAsText(input.files[0]);

};

input.click();

};


/* Export PDF */

document.getElementById("exportPDF").onclick=()=>{

window.print();

};


editor.innerHTML=data.folders[0].pages[0].content;

load();


if('serviceWorker' in navigator){

navigator.serviceWorker.register("service-worker.js");

}

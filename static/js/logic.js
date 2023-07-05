let URL=address+"/test"

d3.json(URL).then(data=>{
    let text=document.querySelector("#text");
    text.innerHTML=`<span class="special">${data[0]}</span> at <a href=${URL}>${URL}</a>`;
})
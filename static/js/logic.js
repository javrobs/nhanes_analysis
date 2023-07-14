let URL=address+"/test"

d3.json(URL).then(data=>{
    let text=document.querySelector("#text");
    text.innerHTML=`<span class="special">${data[0]}</span> at <a href=${URL}>${URL}</a>`;
})



function populate(year){
    if (year.value!=="default"){
    let URL=address+"/columns/"+year.value;
    fetch(URL).then(data=>data.json()).then(data=>{
        console.log(data);
        let columnSelect=document.querySelector("#columns");
        columnSelect.innerHTML="";
        columnSelect.removeAttribute("disabled")
        data.forEach(one=>{
            columnSelect.innerHTML+=`<option value=${one}>${one}</option>`
        })
    });
    
}
}
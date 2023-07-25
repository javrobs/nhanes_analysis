const URL = '/queries';

const value = 'test';


function hi(element){
    // console.log(element.value)
    fetch(URL,
        {
        method: 'POST',
        mode :'cors',
        headers: 
            {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({column: element.value})
        }).then(data.JSON()).then(data => {})
}

// function hi(){fetch(URL,
//     {
//     method: 'POST',
//     mode :'cors',
//     headers: 
//         {
//         "Content-Type": "application/json"
//         },
//     body: JSON.stringify({column: value})
//     }).then(data.JSON()).then(data => {})
// }

window.onload = () =>{
    let b = new Blog('8835176754923159921', 'AIzaSyDxFD1YKLeGD5SOJR04ciEWvfrSKtTX88w');

    let div = document.createElement('div');

    b.requestPost('5273036682298180657').then((r) =>{
        div.innerHTML = r.title + r.updated + r.content;

        document.body.appendChild(div);
    })

    
}
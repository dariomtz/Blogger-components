/*
Example for testing

blogId = 8835176754923159921
API key = AIzaSyDxFD1YKLeGD5SOJR04ciEWvfrSKtTX88w

postId = 5273036682298180657

pageId = 2952231245594029396
label = portfolio

*/

window.onload = () =>{
    let b = new Blog('8835176754923159921', 'AIzaSyDxFD1YKLeGD5SOJR04ciEWvfrSKtTX88w');

    

    b.requestPost('5273036682298180657').then((r) =>{
        post(r);

        makeLine();

        b.requestPage('2952231245594029396', 'portfolio').then((r)=>{
            post(r.page);

            for (const p in r.feed.items) {
                makeLine();
                post(r.feed.items[p]);
            }
            
        })
    })
}

function post(PostObject) {
    let div = document.createElement('div');
    div.innerHTML = PostObject.title + PostObject.updated + PostObject.content;

    document.body.appendChild(div);
}

function makeLine() {
    let hr = document.createElement('hr');
    document.body.appendChild(hr);
}
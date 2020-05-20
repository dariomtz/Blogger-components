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

    //new PostPage('7770545263904878632', b, 'parent');
    //new PagePage('2952231245594029396', b, 'parent', 'portfolio');
    
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
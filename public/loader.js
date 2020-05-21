/**
 * The Blog class handles everything related to the Blogger API
 * file: Blog.js
 */

class Blog {
    /**
     * Instanciates a Blog object
     * 
     * @param {String} blogID The blogID in the URL of the Blogger editor.
     * @param {String} APIkey Given here https://developers.google.com/blogger/docs/3.0/using#APIKey 
     */
    constructor(blogID, APIkey){
        this.id = blogID;
        this.key = APIkey;
        this._url = 'https://www.googleapis.com/blogger/v3/blogs/' + this.id + '/';
    }

    /**
     * Request the post whose id is given and returns the Post Resource Object.
     * 
     * @param {String} postId The identifier of the desired post to retrieve.
     * @returns {Object} The post resource of the blogger API with the fields title, content, and updated
     */
    async requestPost(postId){
        return await this._request(this._url + 'posts/' + postId + '?key=' + this.key + '&fields=title,content,updated,kind');
    }

    /**
     * Request a page.
     * 
     * @param {String} pageId The identifier of the desired page to retrieve
     * @returns {Object} The object that contains the page.
     */
    async requestPage(pageId){
        return await this._request(this._url + 'pages/' + pageId + '?key=' + this.key + '&fields=title,content,updated,kind');
    }

    /**
     * Request a feed of posts related to the label.
     * 
     * @param {String} label The label of the feed of post that is going to be requested
     * @returns {Object} The object containing the list of posts.
     */
    async requestFeed(label){
        return await this._request(this._url + 'posts' + '?key=' + this.key + '&labels=' + label + '&fields=nextPageToken,items(title,content,id,labels)');
    }

    /**
     * Requests the next bunch of post of the feed.
     * 
     * @param {String} nextPageToken Token that was given by the previous feed requested
     * @returns {Object} The object of lists of posts that is next to the previos one.
     */
    async requestNextFeed(nextPageToken){
        return await this._request(this._url + 'posts' + '?key=' + this.key + '&pageToken=' + nextPageToken + '&fields=nextPageToken,items(title,content,id,labels)');
    }
    
    /**
     * This is a generic method to make any request.
     * Intended to be private because an instance of this object should only call requestPage and requestPost, 
     * instead of using this method directly
     * 
     * @param {String} url url of the request
     * @returns {Object} The response of the request as an object
     */
    async _request(url){
        return await new Promise(resolve =>{
            const Http = new XMLHttpRequest();
            Http.open("GET", url);
            
            Http.onload = (e) => {
                let jsonResponse = JSON.parse(Http.responseText);
                
                resolve(jsonResponse);
            }

            Http.onerror = function () {
                resolve(undefined);
            };

            Http.send();
        })
    }
}

/**
 * Class that defines the behavior of a page.
 * file: Page.js
 */
class Page {

    /**
     * Creates an instance of a Page.
     * @param {String} id The identifier of the given page or post.
     * @param {Blog} blog The Blog object that interacts with the Blogger API.
     * @param {String} parentId The id of the HTML element that this page will be a child of.
     */

    constructor(id, blog, parentId){
        this.blog = blog;
        this.id = id;
        this.parentId = parentId;
    }

    /**
     * Uses the information given in the constructor to load the elements from the Blogger API.
     * saves the information to this.info
     */
    load(){

    }

    /**
     * Uses the data in this.info to create HTML elements and append them to the parent.
     * Deletes everything in the parent that has the class "loading".
     */
    render(){
        let parent = document.getElementById(this.parentId);

        for (const element of parent.getElementsByClassName('loading')) {
            element.remove();
        }

        this.formatPage()

        parent.appendChild(this.page);
    }

    /**
     * This method turns the data in this.info and turns it into the corresponding HTML elements.
     * 
     * @returns {HTMLElement} The page as an HTML element.
     */
    formatPage(){
        let page = document.createElement('div');
        page.id = this.id;

        let title = document.createElement('h2');
        title.id = this.id + '-title';
        title.innerHTML = this.info.title;

        page.appendChild(title);
        
        if (this.info.kind === 'blogger#post'){

            let date = document.createElement('span');
            let lastUpdated = new Date(this.info.updated);
            date.id = this.id + '-date';
            date.innerHTML = 'Updated on ' + lastUpdated.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});

            page.appendChild(date);
        }
        
        let line = document.createElement('hr');
        
        page.appendChild(line);

        this.processContent();
        let content = document.createElement('div');
        content.id = this.id + '-content';
        content.innerHTML+=this.processContent;

        page.appendChild(content);

        this.page = page;
    }

    /**
     * Process the commands, clears them out and changes them to the respective html text that corresponds to it.
     */
    processContent(){
        this.processContent = '';

        let partsWithoutLines = this.info.content.split('*line*');
                
        for (var i = 0; i < partsWithoutLines.length -1; i++) {
            this.processContent += partsWithoutLines[i] + '<hr>'
        }

        this.processContent += partsWithoutLines[partsWithoutLines.length -1];

        if (this.info.kind === 'blogger#post'){
            let partsWithoutDescriptionCommand = this.processContent.split('*desc*');

            this.processContent = '';

            for (var i = 0; i < partsWithoutDescriptionCommand.length -1; i++) {
                this.processContent += partsWithoutDescriptionCommand[i];
            }

            this.processContent += partsWithoutDescriptionCommand[partsWithoutDescriptionCommand.length -1];
        }
    }
}

/**
 * Class that renders a Post
 */
class PostPage extends Page{
    /**
     * Creates an instance of a PostPage.
     * @param {String} postId The identifier of the given post.
     * @param {Blog} blog The Blog object that interacts with the Blogger API.
     * @param {String} parentId The id of the HTML element that this page will be a child of.
     */
    constructor(postId, blog, parentId){
        super(postId, blog, parentId);

        this.load().then(()=>{
            this.render();
        });
    }

    async load(){
        this.info = await this.blog.requestPost(this.id);
    }
}

class PostPreview {

    /**
     * Creates an instance of the PostPreview object.
     * @param {Object} post The post object.
     * @param {String} parentId The id of the HTML parent.
     */
    constructor(post, parentId){
        for (const key in post) {
            if (post.hasOwnProperty(key)) {
                const value = post[key];
                this[key] = value;
            }
        }

        this.parentId = parentId;

        this.render();
    }

    /**
     * Creates a card for each the post and appends it to the parent html
     */
    render(){
        let card = document.createElement('div');
        card.className = 'post';
        card.id = this.id;

        this.labels.forEach(label => {
            card.classList.add(label)
        });

        let title = document.createElement('h5');

        title.innerHTML = this.title;

        card.appendChild(title)

        let desc = document.createElement('p');

        desc.innerHTML = this.content.split('*desc*')[1];

        card.appendChild(desc);

        let btn = document.createElement('a');

        btn.href = './posts/' + this.id;
        btn.innerHTML = 'Read more >>';

        card.appendChild(btn);

		document.getElementById(this.parentId).appendChild(card);
    }
}

/**
 * Class that renders a Page and list of posts related.
 */
class PagePage extends Page{
    /**
     * Creates an instance of a PagePage.
     * @param {String} postId The identifier of the given page.
     * @param {Blog} blog The Blog object that interacts with the Blogger API.
     * @param {String} parentId The id of the HTML element that this page will be a child of.
     * @param {String} name The name of the label
     */
    constructor(pageId, blog, parentId, name){
        super(pageId, blog, parentId);
        this.name = name.toLowerCase();

        this.load().then(()=>{
            this.render();
        })
    }

    /**
     * Uses the blog object to load the content of the page
     */
    async load(){
        this.info = await this.blog.requestPage(this.id);
        let feedRequest = await this.blog.requestFeed(this.name);

        this.feed = (feedRequest.items !== undefined) ? feedRequest.items : [];
        this.nextPageToken = feedRequest.nextPageToken;
    }

    /**
     * When there are lots of posts, it loads the content of the next list of posts. 
     */
    async loadMorePosts(){
        let request = await this.blog.requestNextFeed(this.nextPageToken);
        
        request.items.forEach(post => {
            this.feed.push(post);
        });

        this.nextPageToken = request.nextPageToken;

        this.renderFeed();
    }

    /**
     * Makes HTML for the page and for the feed.
     */
    render(){
        super.render();
        this.renderFeed();
    }

    /**
     * Turns every object in feed into a PostPreview object and saves it in this.posts.
     */
    renderFeed(){
        let loadMoreBtn = document.getElementById('load-more');
        
        if(loadMoreBtn !== null){
            loadMoreBtn.remove();
        }

        let feedContainer = document.createElement('div');

        feedContainer.id = this.id + '-feed';

        this.page.appendChild(feedContainer);

        this.posts = [];

        this.feed.forEach((post) =>{
            this.posts.push(new PostPreview(post, this.id + '-feed'));
        });

        this.feed = [];

        if (this.nextPageToken !== undefined){
            loadMoreBtn = document.createElement('button');
            loadMoreBtn.id = 'load-more';
            loadMoreBtn.innerHTML = 'Load more...'

            loadMoreBtn.addEventListener('click', this.loadMorePosts.bind(this));

            feedContainer.appendChild(loadMoreBtn);
        }
    }
}
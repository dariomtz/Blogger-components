/**
 * The Blog class handles everything related to the Blogger API
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
        return await this._request(this._url + 'posts/' + postId + '?key=' + this.key + '&fields=title,content,updated,labels,kind');
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
    async requestNextFeed(label, nextPageToken){
        return await this._request(this._url + 'posts' + '?key=' + this.key + '&labels=' + label + '&pageToken=' + nextPageToken + '&fields=nextPageToken,items(title,content,id,labels)');
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
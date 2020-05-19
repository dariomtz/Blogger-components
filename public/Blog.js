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
        return await this._request(this._url + 'posts/' + postId + '?key=' + this.key + '&fields=title,content,updated');
    }

    /**
     * Request a page and all the posts that have the label specified.
     * Useful for Pages that are asociated with Feeds.
     * 
     * @param {String} pageId The identifier of the desired page to retrieve
     * @param {String} label The lable that identifies the posts of that feed
     */
    async requestPage(pageId, label){
        let [page, feed] = await Promise.all([
            this._request(this._url + 'pages/' + pageId + '?key=' + this.key + '&fields=title,content,updated'),
            this._request(this._url + 'posts' + '?key=' + this.key + '&label=' + label + '&fields=items(title,content,id,labels)'),
        ]);

        return {
            page: page,
            feed: feed,
        };
    }
    /**
     * This is a generic method to make any request.
     * Intended to be private because an instance of this object should only call requestPage and requestPost, 
     * instead of using this method directly
     * 
     * @param {String} url url of the request
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
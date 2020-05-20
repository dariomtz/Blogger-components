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

        this.feed = feedRequest.items;
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
        
        for (const post of this.feed) {
            this.posts.push(new PostPreview(post, this.id + '-feed'));
        }

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
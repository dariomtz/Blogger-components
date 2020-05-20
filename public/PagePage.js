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

    async load(){
        let request = await this.blog.requestPage(this.id, this.name);
        this.info = request.page;
        this.feed = request.feed;
    }
}
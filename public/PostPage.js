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
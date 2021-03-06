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
        
        btn.className = 'post-link';
        btn.href = './posts/' + this.id;
        btn.innerHTML = 'Read more >>';

        card.appendChild(btn);

		document.getElementById(this.parentId).appendChild(card);
    }
}
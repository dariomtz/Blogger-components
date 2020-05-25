/**
 * Class that defines the behavior of a page.
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
        let wrapper = document.createElement('div');
        wrapper.id = this.id + '-wrapper';

        let title = document.createElement('h2');
        title.id = this.id + '-title';

        if(this.info.error !== undefined){
            title.innerHTML = '404: Not found';
            return;
        }else{
            title.innerHTML = this.info.title;
        }
        
        wrapper.appendChild(title);
        
        if (this.info.kind === 'blogger#post'){

            let date = document.createElement('span');
            let lastUpdated = new Date(this.info.updated);
            date.id = this.id + '-date';
            date.innerHTML = 'Updated on ' + lastUpdated.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});

            wrapper.appendChild(date);
        }
        
        let line = document.createElement('hr');

        wrapper.appendChild(line);

        let content = document.createElement('div');
        content.id = this.id + '-content';

        if (this.info.error !== undefined){
            content.innerHTML = 'Sorry! <br> We cannot find the page you are looking for. <br> Check for mistakes in the URL.'
        }else{
            this.processContent();
            content.innerHTML = this.processContent;
        }

        wrapper.appendChild(content);

        let page = document.createElement('div');
        page.id = this.id;

        page.appendChild(wrapper);

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
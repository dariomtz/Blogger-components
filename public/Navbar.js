/**
 * An object that dinamically populates your Navbar
 */
class Navbar{
    /**
     * This creates an instance of Navbar and Populates the parent given.
     * @param {String} parentId The list object that is going to have the navbar elements
     * @param {Object} pages The object with the information of your pages
     */
	constructor(parentId, pages){
		
		for (const key in pages) {
			if(key != ''){
                let page = pages[key];
				let p = document.createElement('li');
				p.className = "nav-item";
				p.id = key;

				let link = document.createElement('a');
				link.className = 'nav-link';
				link.href = '/' + key;
				link.innerHTML = page.title;

				p.appendChild(link);
				document.getElementById(parentId).appendChild(p);
			}
		}
	}
}
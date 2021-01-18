# Blog api for Blogger REST API v3
 
 Include in your HTML:
```HTML
<script src="https://blogger-components.web.app/Blog.min.js" type="text/javascript"></script>
```

## Usage

Once you have the script included in your page, you can access the class ```Blog```.

### instantiation

The ```Blog``` class has the following constructor:

```JavaScript
Blog(blogId, APIKey);
```

The ```blogId``` parameter is a string that specifies the Id of the blog you want to retreive information from. It is usually in the url of the Blogger interface.

The ```APIKey``` paramenter is the APIKey given by the Google Cloud console. You can get one using [this link](https://developers.google.com/blogger/docs/3.0/using#APIKey).

### Requesting a single post or page

This is as simple as calling the ```requestPost(id)``` or ```requestPage(id)``` method on the instance of your ```Blog``` object. 

Keep in mind that these are asynchronous methods, so they return a [```Promise```](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### Requesting multiple posts

When you want to retreive multiple posts using the ```requestFeed(labels)``` method. This will return the latest 10 posts, as well as a pagination token in case you need to retreive more. 

The ```labels``` parameter can be used to filer by labels using a coma-separated string with the names of the labels. It can also be left empty.

To request the next posts, use ```requestNextFeed(labels, nextPageToken)```. Keep in mind that if you want to keep filtering by label, the labels field is still needed.

Keep in mind that these are asynchronous methods, so they return a [```Promise```](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

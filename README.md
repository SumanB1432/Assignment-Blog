# Assignment-Blog

### Models
- Author Model
```
{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }
```
- Blogs Model
```
{ title: {mandatory}, content: {mandatory}, userId: {mandatory, refs to user model},userName:{mandatory,string} ,createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}}
```

### User APIs /users
### POST/users
- Create a user document form request body.
- End point `localhost:5000/user`(POST REQUEST)
- Return HTTP status 201 on a successful user creation. Also return the user document.
- Return HTTP status 400 for an invalid request with a response body .


### POST /blogs
- Create a blog document from request body. Get userId in request body only.
- End point `localhost:5000/createblog`(POST REQUEST)
- Return HTTP status 201 on a successful blog creation. Also return the blog document.
- Return HTTP status 400 for an invalid request with a response body .

### GET /blogs
- Get the filter request form the request body.
- End point `localhost:5000/blog/get`(GET REQUEST)
- Pagination is implement in this api you can pass `page` and `limit` through query parameters.
- Returns all blogs in the collection that aren't deleted and those are match with the filter like(user name, userId,title,timestamps)
- Return the HTTP status 200 if any documents are found.
- If no documents are found then return an HTTP status 404 with a response body.


### PUT /blogs/:blogId
- Updates a blog by changing the its title, content.
- End point `localhost:5000/blog/update/:blogId`(PUT REQUEST)
- Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body.
- Return an HTTP status 200 if updated successfully with a response.
 

### DELETE /blogs/:blogId
- Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
- If the blog document doesn't exist then return an HTTP status of 404 with a body.

### POST /login
- Allow an user to login with their email and password. On a successful login attempt return a JWT token contatining the userId
- If the credentials are incorrect return a suitable error message with a valid HTTP status code(401 for not authenticated)

### Authentication
- Add an authorisation implementation for the JWT token that validates the token before every protected endpoint is called. If the validation fails, return a suitable error message with a corresponding HTTP status code(`403 FORBIDDEN`)
- Protected routes are create a blog, edit a blog, get the list of blogs, delete a blog(s)
- Set the token, once validated, in the request - `x-api-key`
- Use a middleware for authentication purpose.

### Authorisation

- Only the owner of the blogs is able to edit or delete the blog.
- In case of unauthorized access return an appropirate error message.





#### DATABASE URL : - `mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/assignment_blog`
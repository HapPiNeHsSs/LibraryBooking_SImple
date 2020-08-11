
**

# Simple Library System

DEPLOYMENT

Prerequisites: 
-Node v12.16.1
-MongoDB

Configuration Variables are inside the **.env** file on the root directory

Config Contents:

    WEB_PORT=8000
    DB_NAME=library
    DB_URL=mongodb://localhost:27017/
    SECRET_TOKEN=secret
    MAX_BORROW=5
    DURATION=30
    LOG_PATH=log

LOG_PATH can be omitted and will just default to log
Uses JWT for authentication, so some extra steps when you test. The login api will provide the JWT token, as is common.

run '**npm install**' to install the packages

run '**node app.js**' to run the service

For testing purposes, I have prepared a postman collection under the postmanCollection directory. I used this to test functionalites. 
A unit test would have been nice, but I started 5 hours late due to a shitty deployment for a client (s.n.tel ..save me).
**

## APIs

**POST /user - Registers a user**

BODY: JSON

Data:
    {
    
    "user_id":"Beejay",
    
    "password":"pass",
    
    "name":"Beejay Urzo"
    
    }
   Notes: Name can be a duplicate, user_id cannot
   
Errors: Will throw errors for parse failures, missing params, and duplicate user_id

Returns:

    {
    
    "username": "Beejay1",
    
    "status": "registered"
    
    }
---
**POST /login - Logins a user**

BODY: JSON

Data:
 

      {"username":"beejay","password":"pass"}

  
   
Errors: Will throw errors for Unauthorized and missing Params

Returns: JWT Authorization token. Needed to access protected APIs

       {
    
    "user": "beejay",
    
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMzMwNzIyM2I2N2VjN2U0ZjBlZmU3NiIsInVzZXJuYW1lIjoiYmVlamF5IiwiaWF0IjoxNTk3MTgxOTE2fQ.PRVHajFBBxN_ISAYzDX-hIuHMXPwLcpzpQQ0jTUS9uI"
    
    }
---
**GET /user - Gets user information and record of borrowed books**

HEADERS:
- Authorization: Bearer < TOKEN >

Errors: Will throw errors for Unauthorized

Returns: User info and record

	{
    
    "user_info": {
    
    "_id": "5f3307223b67ec7e4f0efe76",
    
    "username": "beejay",
    
    "customer_name": "Beejay Urzo",
    
    "createdAt": "2020-08-11T21:01:22.883Z",
    
    "updatedAt": "2020-08-11T21:01:22.883Z",
    
    "__v": 0
    
    },
    
    "books_borrowed": [
    
    {
    
    "_id": 0,
    
    "book": [
    
    2
    
    ],
    
    "user": [
    
    "5f3307223b67ec7e4f0efe76"
    
    ],
    
    "returned": false,
    
    "borrow_date": "2020-08-11T21:14:23.573Z",
    
    "createdAt": "2020-08-11T21:14:23.575Z",
    
    "updatedAt": "2020-08-11T21:14:23.575Z",
    
    "__v": 0
    
    }
    }
---
**POST /books - Adds a book**

BODY: JSON

Data:

      {
    
    "isbn":"0-11-928",
    
    "name":"A book part 2",
    
    "publish_date":"04-23-1991",
    
    "author":"Hobo Dude",
    
    "summary":"A book about nothingness"
    
    }

 Note: ISBN and Name can be duplicates. ID is auto incremented at the backend
 
Errors: Will throw errors for missing Params and parse errors

Returns: Successful addition of book

       {
    
    "Success": "Book Added"
    
    }
---
**GET /books - Gets Book info**

PARAMS: 
- name: book name. Exact name but case insensitive
- isbn: Exact ISBN Number

Note: ISBN and Name will be used as an AND filter. Omitting both will show all books

Returns: Book List
   

      [{"id":0,"isbn":"0-11-928","name":"A book part 2","author":"Hobo
    
    Dude","publish_date":"1991-04-22T16:00:00.000Z","summary":"A book about
    
    nothingness","createdAt":"2020-08-11T21:02:00.221Z","updatedAt":"2020-08-11T21:02:00.221Z","__v":0},{"id":1,"isbn":"0-11-928","name":"A
    
    book part 2","author":"Hobo Dude","publish_date":"1991-04-22T16:00:00.000Z","summary":"A book about
    
    nothingness","createdAt":"2020-08-11T21:02:02.658Z","updatedAt":"2020-08-11T21:02:02.658Z","__v":0},{"id":2,"isbn":"0-11-928","name":"A
    
    book part 2","author":"Hobo Dude","publish_date":"1991-04-22T16:00:00.000Z","summary":"A book about
    
    nothingness","createdAt":"2020-08-11T21:02:05.524Z","updatedAt":"2020-08-11T21:02:05.524Z","__v":0}]
---
**UPDATE /books - Updates Book info**

BODY: JSON 

Data:

    {
    
    "id":34,
    
    "isbn":"0-11-928",
    
    "name":"A book part 3",
    
    "publish_date":"04-23-1991",
    
    "author":"Hobo Dude",
    
    "summary":"A book about nothingness"
    
    }
Note that the ID param is required. WIll throw an error if omitted.

The other parameters are optional, you can update only what you want

Returns: 

    {
    
    "Updated": "Book with ID 1 has been updated"
    
    }
---
**DELETE /books - Updates Book info**

PARAMS: 
- ID: Id of the book you want to delete

Note that the ID param is required. WIll throw an error if omitted.

The other parameters are optional, you can update only what you want

Returns: 

       {
    
    "Updated": "Book with ID 2 has been deleted"
    
    }
---
**POST books/borrow - Borrows a book**

HEADERS:
- Authorization: Bearer < TOKEN >

BODY: JSON 

Data:

    {"book_id":2 }

Authenticated User Only. Borrows a book

Errors: Checks if book is actually present. Throws error if MAX_BORROW is exceeded, Throws missing params errors

Returns: 

    {
    
    "Success": "Book Borrowed",
    
    "borrow_id": 7
    
    }
    
 Note the borrow_id, you would need this when returning a book
    
---
**POST books/return - Returns a book**

HEADERS:
- Authorization: Bearer < TOKEN >

BODY: JSON 

Data:

 

       {"borrow_id":2 }

Authenticated User Only. Returns a book

Errors: Checks if book was actually borrowed. Throws missing params errors

Returns: 

    {
    
    "Updated": "Book with borrow ID 6 has been returned"
    
    }


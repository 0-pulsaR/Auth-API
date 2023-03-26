# Auth / User API 
This is an Authentication and User API created with [Express.js](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

## Installation
After cloning the repository run:
```sh
    cd auth-api
    npm install
``` 
<br>

**NOTE:**  Before running the API make sure to edit the **``` .env ```** file

<br>

For development environment: 
```sh
    npm run dev
```
For production environments:
```sh
    npm run prod
```
<br>

**NOTE:** *This API uses* [Mailslurp](https://www.mailslurp.com/) *as an email service. Can be replaced with other service as well as email HTML schemes under:*

```
utils
│   ├── mailer.js
│   └── mailHTMLSchemes.js
```

<br>
<br>

### Feel free to create an Issue
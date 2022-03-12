# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["URLS Page"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/My%20URLs.png?raw=true)

!["Create New URL"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Create%20New%20URL.png%20.png?raw=true)

!["Edit Page"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Edit%20page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- body-parser
- cookie-session
- method-override

## Getting Started

1. Install all dependencies (using the `npm install` command).
2. Run the development web server using the `node express_server.js` command.
3. On your browser, Go to [localhost:8080/urls](http://localhost:8080/urls).

## How To Use TinyApp

  - **Register/Login**

> Users must be logged in to create new short URLs.
>
> To sign up, click on `Registration`. Enter your email and set a password.

  - **Create New short URLS**

> Click `Create New URL` on navigation bar.
Then enter the long URL you want to shorten.

  - **Edit or Delete Short URL**

> In My URLs, you can `Delete` any link.
>
> By click on `Edit`, you will redirect to edit page.
>
> 📝. Only owner of the link has access to these features.

  - **Edit page**

> In edit section, enter a new long URL to update that in the database.

> In this page you can check some statistics about URL visit:
>
> - How many times your link been used.
>
> - How many times been visited by unique users.
>
> - In addition, a table that shows all the history of usage of that link.

  - **Use Short URL**

> The path to use any short URL is *`/u/shortURL`*.
>
> This will redirect users to the long URL.
You can provide this link to any one you want.


- **Some of the Error messages**:

!["Error - URL Not Found"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Error-%20URL%20Not%20Found.png?raw=true)

!["Error-Page Not Found"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Error-%20Page%20Not%20Found.png?raw=true)

!["Error-Access Denied"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Error-%20Access%20Denied.png?raw=true)

!["Error-Login"](https://github.com/FarzanehSa/tinyapp/blob/main/docs/Error-%20Login.png?raw=true)


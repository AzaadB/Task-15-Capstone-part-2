# System Architecture

---

# What system architecture will be used to create the frontend and backend?

---

The system architecture that will be used to create this web application is React and express, React will be used for the frontend of the application and express will be the server and will deal with the authenticating a user.

# Where will the app be deployed to?

---

1.) It will be deployed to Github and to render.com, so that users can access the appliction on Github where the whole applications coding javascript files will be.

2.) It will include instructions on how to use it if running it through an IDE, and render.com will be where the actual UI will be displayed if the link is clicked.

# How is it going to be styled?

---

1.) All the styling will be done within the components Javascript file, where it will be stored in a variable.

2.) ie. if I'm styling a list I would create a list variable like this const list with jsx and store my styling in it.

# System Requirement Specifications

---

# Functional Requirements

---

1.) The app should allow for normal end-user access and admin access

2.) It should authenticate for users using a normal username and password.

3.) It should also allow an administrator to be able to monitor and make changes to users’ behaviour.

4.) It creates, reads, updates and deletes information from MongoDB

# Non-Functional Requirements

---

1.) It is built using Express, React and MongoDB (the MERN stack).

2.) It has a custom server built using Express.

# A) Clear instructions that an end user will be able to follow to install, test and run the app on their local machine.

---

Firstly get all the code from the following Github repository: https://github.com/AzaadB/Task-15-Capstone-part-2,
then once you have downloaded it, then unzip the folder inside called Task-15-Capstone-part-2 once that is done, the open it in VS code and open a terminal and type cd Backend and type npm install that will node_modules and then type npm test to test the app and to run the backend type npm start it will start the server, then open another VS code window or open another terminal in the one window and type cd frontend-cars type npm install that will node_modules and then type npm test to test the app and to run the frontend type npm start it that will open your browser and load the frontend of the app.

# B) How to use the App

---

Once the server is running and the app has loaded in your browser, then you just click the login link at the bottom of the page you'll be taken to the login page, but the things you actually need to do before you can log in is that you need a .env file to store your mongoDB database uri, which you'll get when you create your mongoDB account and connect via the app, you'll also need an Access Token and Refresh Token and you can get that by typing in the terminal Node that will put you at the nodejs prompt once there you type the following: require("crypto").randomBytyes(64).toString("hex) and press enter and then you'll get your access token and to get the refresh token just re-type this: require("crypto").randomBytyes(64).toString("hex) and you'll get your refresh token.

Once you have your mongoDB database uri, access token and refresh token stored in your .env file then you can login with the following users: Username: Pete, Password: 123ABCabc!, Username: Peter, Password: 123ABCabc!, Username: Joe, Password: 123A, once you've logged in with one of them you'll see at the bottom their status meaning if they're an Admin, Manager or Employee, you'll also see what they can see and do i.e if they're an Admin they'll see everything which in this case would be the cars and users and do everything such as read, create, update and delete cars and users, but if they're only an Employee they can only see the cars and can only read the cars and create new cars.



# C) A description of the measures that have been taken to ensure the security of this app, including a description of how API keys have been dealt with.

---

To deal with the security of the app I have used JWT(Json Web Tokens), with the api keys we have stored them in an dot env file.

# D) A description of any third-party middleware that was used.

---
The third-party middleware that was used is cookie-parser which allows the rest api to parse cookies that have been used in this app


# E.1) A description of where and how the application has been deployed.

---
The application has been deployed at render.com and it has been deployed by linking render.com to the following github repository: https://github.com/AzaadB/Task-15-Capstone-part-2

# E.2) Back-end and front-end together or separate? Why?

---
I have deployed the backend and frontend separate, because with render.com you can have the server as a web Service which is acting as the rest api and without the it frontend won't work because it's just a static site which it has been deployed as and everyone can see it. 

# E1) A link (or links) to the deployed app

---

Web Server: MUST CLICK LINK IN ORDER TO MAKE THE ONE BELOW WORK PROPERLY: https://zany-car-notes-api.onrender.com (backend- server link)

Static Site: https://zany-car-notes.onrender.com (frontend)

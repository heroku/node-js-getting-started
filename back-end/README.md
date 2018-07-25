# Back End Project Week
This week you will be building a backend for a note taking app called "Lambda Notes."

You are to treat this week as if you are working at a company and the instructor is your client.  The teaching assistants are acting as your project managers and will be your main support throughout the week.

The main objective of this week is to develop a backend to support the LambdaNotes app you built during the Front End project week, connect the two projects together, and add some additional features. You will use NodeJS, MongoDB and any other technologies you have learned here at Lambda School.

## Git Commits
* You are required to showcase progress with at least 1 commit a day.  This will let your project manager know where you are and if you need help.  This also allows the client to get progress reports from the company in a real world setting. This also protects you from losing your work if your computer blows up.

## Trello Set Up:
* [ ] Use your existing Trello account from the Front End Project, or create a new one
* [ ] Create a new board called "Lambda Notes(Backend) - {Your Name}"
* [ ] Create lists titled `backlog`,`To Do`, `In Progress`, and `Done`
* [ ] Fill in the `To Do` list with the Backend MVP features listed below
* [ ] Fill in the `backlog` list with all the extra features listed below
* [ ] Share your board with the project manager that has been assigned to you.  If you have not been assigned yet, reach out to your Section Lead for guidance
* [ ] Add your Trello URL to your project's README.md file.  Commit the change, push it to your repository & submit a pull request

## Backend MVP Features:
It is suggested that you deploy the server and database first, before you undergo implementing the logic. Doing this makes the deployment process much simpler, since there's no code yet to complicate the deployment step. We recommend you deploy your server to [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction), and your Mongo database to [mlab](https://docs.mlab.com/). The recommended deployment site for the front end is [netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/). 

Once you have empty projects deployed to these platforms, they can be easily updated with the code you implement as you write it. Additionally, it is recommended that you keep your front end and backend codebases in separate github repos, not under a single umbrella repo. This helps with separation of concerns, plus it helps with deploying, since the different parts of your full-stack codebase need to live on different platforms. 

* [ ] Create a Database for your app
* [ ] Design your models for your app. You should have a model for notes and for users. (The users model will come in handy when building out your stretch goals).
* [ ] Deploy your application to the web
* [ ] Create a Node app and connect it to your database
* [ ] Store Notes in your Database

Build an API Endpoint for each of the following, and connect it to your React App. These should all be read from your Database and scoped to the logged in user.
* [ ] Display a list of notes
* [ ] Create a note with a title and content
* [ ] View an existing note
* [ ] Edit an existing note
* [ ] Delete an existing note
* [ ] Link up your Front End Project to your new and improved backend

Upon your first commit, please submit a Pull Request and add _both_ the **Trello Set Up** and **Backend MVP Features** Task lists to your first Pull Request comment:

```markdown
## Trello Set Up:
* [ ] Use your existing Trello account from the Front End Project, or create a new one
* [ ] Create a new board called "Lambda Notes(Backend) - {Your Name}"
* [ ] Create lists titled `backlog`,`To Do`, `In Progress`, and `Done`
* [ ] Fill in the `To Do` list with the MVP features listed below
* [ ] Fill in the `backlog` list with all the extra features listed below
* [ ] Share your board with the project manager that has been assigned to you.  If you have not been assigned yet, reach out to your Section Lead for guidance
* [ ] Add your Trello URL to your project's README.md file.  Commit the change, push it to your repository & submit a pull request

## Backend MVP Features:
* [ ] Create a Database for your app
* [ ] Design your models for your app. You should have a model for notes and for users. (The users model will come in handy when building out your stretch goals).
* [ ] Deploy your application to the web
* [ ] Create a Node app and connect it to your database
* [ ] Store Notes in your Database

Build an API Endpoint in your Node App for each of the following, and connect them to your React App. These should all be read from your Database and scoped to the logged in user.
* [ ] Display a list of notes
* [ ] Create a note with a title and content
* [ ] View an existing note
* [ ] Edit an existing note
* [ ] Delete an existing note
* [ ] Link up your Front End Project to your new and improved backend
```

***
## Once you have completed the Backend Minimum Viable Product requirements, direct message your project manager for approval.  If approved, you may continue working on the Extra Features. Please add the Extra Features to your Task List in the first comment on your PR.

Once your MVP has been approved, you have been given a feature list that the client would love to have completed.  Your goal would be to finish MVP as soon as you can and get working the list of features.

## Extra Features:
* [ ] Create a Registration Page that allows users to create accounts for your app and sign in with email/password
* [ ] Write tests for your endpoints and models
* [ ] Be sure to provide documentation for how to interface with your api
* [ ] Allow users to sign in with a third party service (google, facebook, github, club penguin, etc...)
* [ ] Search functionality
* [ ] Allow multiple users to collaborate on notes
* [ ] Add pagination for long lists of notes
* [ ] Create and display tags that can be added to notes and stored in the Database
* [ ] Allow users to clone notes
* [ ] Allow users to attach images to notes
* [ ] Allow users to create Lists and assign notes to a list
* [ ] Setup Auto-Deploy on Heroku

## Super Duper Extra Credit Bonus Features
* [ ] Add a payment form integrating with Stripe that allows Users to buy a "Premium" version of LambdaNotes.
* [ ] Gate your favorite feature behind the premium paywall

You will notice that this repository does not have any starter code.  This is on purpose.  You are to start from scratch using any files you have built throughout your time here at Lambda School.

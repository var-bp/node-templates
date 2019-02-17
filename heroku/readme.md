Deploying to Heroku (PaaS)

```
heroku update // update cli
heroku login // login to Heroku
heroku create // inside folder https://devcenter.heroku.com/articles/getting-started-with-nodejs
```

Don’t forget to add your .env to .gitignore to avoid sharing it in the version control system
Configuration and Config Vars https://devcenter.heroku.com/articles/config-vars
Add-ons for Heroku https://addons.heroku.com. For example: PostgreSQL, SendGrid, MongoHQ

Here is a step-by-step breakdown using Git to deploy to Heroku:
```
git init // create a local Git repository and .git folder if you haven’t done so already
git add . // add files
git commit -m "my first commit" // commit files and changes
heroku create // create the Heroku Cedar stack application, Cedar stack is a special technology that Heroku uses to create and run its apps
git remote show // to look up the remote type and execute, optional
git push heroku master // deploy the code to Heroku, or git push heroku branch_name
heroku open // to open the app in your default browser, http://yourappname-NNNN.herokuapp.com
heroku logs // to look at the Heroku logs for this app
```

To update the app with the new code, type the following only:
```
git add –A
git commit -m "commit for deploy to heroku"
git push heroku master
```

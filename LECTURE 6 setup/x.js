// how to set up the backend project:

// 1) make the readme.md file and package.json by npm init.

// 2) add and commit this files to git using commands:
// git add .
// git commit -m "hii"
// git branch -M main. (using these our branch name changes to main)

// 3) now make the repo in github and coonect the project to it.
// git remote add origin https://github.com/rohitbhamare-hub/chai-backend.git
// git push -u origin main. (now using these we push the project to git)

// 4) install nodemon which directly push the changes to git . if we not install it , then we have to manually 
// push every time .
// npm i -D nodemon  (here we use -D bcoz we only want to use for dev not production)
// also we have to write the file name in package.json which we have to update automatically , like
// "dev":"nodemon src/index.js".

// 5) we have also created a temperory folder as temp , and to keep track of it in git we make a file .gitkeep
// as git only updates files not folder , so if we have to keep track of folder we have to make this file.
// also we have make .env file for env variables.
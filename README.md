pulse and pause
=================

A single-page app, built with a Firebase back-end and AngularJS. 

## Use Case

The Pomodoro Technique aims to increase your work productivity and quality. In its simplest form, you time your work in 25-minute intervals, with five-minute breaks in between.

During a 25-minute session, you focus on a task. Checking email, answering the phone, or browsing your favorite forum is not allowed. During a break, you do not do anything related to work. You can meditate, do push ups and play with your dog, but you can't think about work.

When implemented with discipline, the Pomodoro Technique can be a powerful tool to increase your productivity. I built this application as part of my coursework through the Bloc, Inc web development program.

## User Story Breakdown

| User Story | Implementation
| :-------: | :--------------: |
| **As a user, I want to start and reset a 25-minute work session** | Create a button with the ngClick directive to trigger function that starts/resets the timer. Use a ngBind directive to handle the button text, i.e., "Start a Work Session", "Reset", "Take a Break", etc. Use Angular's $interval service to execute a function that updates the remaining time every second. |
| **As a user, I want to start and reset a five-minute break after each completed work session** | Create a boolean variable to control the state of the timer. Use the ngShow or ngHide directive to determine what the user sees in the view. When the timer reaches the end of a work session, modify it so the user will see this new time, and the ngShow or ngHide directive used on the buttons will pair the correct button to the timer's state. |
| **As a user, I want to start and reset a longer, 30-minute break after every four completed work sessions** | Create a variable that holds the number of completed work sessions. Increment the count after each completed work session. When the timer reaches the end of a work session, update the time remaining by using a conditional statement to check whether the number of completed work sessions is equal to four - which would then send you to a thirty minute break.  Once all sessions are complete, reset back to 0. |
| **As a user, I want to see a live timer during work sessions and breaks** | Assign the time remaining to a variable and use {{ }} markup or the ngBind directive to render the time remaining in the view. Create a filter to handle the conversion of the time remaining. |
| **As a user, I want to hear a sound at the end of work sessions and breaks** | Add sound with Buzz and trigger a playback. Use a $watch method to register a listener callback to execute whenever the watchExpression changes. Watch the time remaining and call the .play() method on the variable that holds the sound file when the time remaining equals zero. |
| **As a user, I want to record completed tasks** | Sync with Firebase and add tasks. |

## Grunt

This project base uses [Grunt](http://gruntjs.com/) to serve, build and watch project files in development. 

## Directory structure and Grunt

```
app/
 |__pages/
 |   |__index.html
 |__sass/
 |   |__styles.scss
 |__scripts/
 |   |__app.js
 |__templates/
 |   |__home.html
```

### Sass

## Grunt plugins

A list of the plugins used by Grunt and what they're used for.

#### Browserify

[Browserify](http://browserify.org/) allows you to access Node modules included a given JS file while in the browser.

#### Sass

[Grunt Sass](https://github.com/gruntjs/grunt-contrib-sass) for compiling Sass into CSS.

#### Autoprefixer

[Autoprefixer](https://github.com/nDmitry/grunt-autoprefixer) allows you to write CSS free of worrying about vendor prefixes. No need to add `-webkit`, `-moz`, `-ms`, etc to the beginning of your CSS3, because the Grunt Autoprefixer task takes care of it for you.

#### Watch

[Grunt watch](https://github.com/gruntjs/grunt-contrib-watch) watches an array of files for changes and then executes Grunt tasks when a change is detected. Watch is useful for tasks like continuous unit testing (every time you save a file, that new file is tested), refreshing your browser automatically when changes are reflected, or compiling preprocessing languages like Sass or Jade into CSS or HTML.

#### Copy

[Grunt copy](https://github.com/gruntjs/grunt-contrib-copy) allows you to copy files from development folders like images, fonts or other static assets and put them in the folder that will be served on the frontend of your application.

#### Clean

[Grunt clean](https://github.com/gruntjs/grunt-contrib-clean) "cleans" or removes all files in your destination folder (the folder where you'll put your officially served content for your application) so that logic in your stylesheets, templates or scripts isn't accidentally overridden by previous code in the directory.

#### Hapi

[Grunt Hapi](https://github.com/athieriot/grunt-hapi) is a task that runs a server using [`HapiJS`](http://hapijs.com/). Happy is a Node Web Application framework with robust configuration options. Using Hapi allows us to use Angular for our application routing instead of relying on a backend to handle template requests.

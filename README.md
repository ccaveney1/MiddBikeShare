# MiddBikeShare
### Thanks for checking out our React-Native Mobile App with Node Express and MongoDB!

Within the ExpressBackendApp our back end is housed with MongoDB, and deployed with Mongoose
on Heroku. Within the ReactNativeProject directory the front end to our app is stored.
Our code lies within the screens directory, where all the different screens navigated to
throughout the app process are stored.

Admin_components:
  BikeComponents.js - Screen where users with administrative capabilities can access
    and change all the information about the bikes in the database.
  UsersComponent.js - Screen where users with administrative capabilities can access
    and change all the information about the users in the database.
AdminScreen.js - Screen where users with administrative capabilities choose to look
  at bike or user information or go back to the home screen
HomeScreen.js - The main screen that opens up with the app after someone has logged in.
This screen shows a map of Middlebury's campus and all the bikes that are available for rent.
LoginScreen.js - This is the first page that shows up when someone opens the app, and
which facilitates the login through Google Sign In.
RideScreen,js - This is the screen that the app will stay on while someone is renting a
bicycle, it will have an option to park the bike or to report it damaged.

Must have Expo Developer Tools installed, and XCode's iOS simulator.

Pull master branch.

Within ReactNativeProject, run: "npm start" or "expo start"

This will start the packager for the front end. Then, press i on terminal or choose "Run on iOS simulator" on the online Expo Developer Tools to open up the simulator. The project will open on the Expo Application within the simulator.

The backend server is running at https://midd-bikeshare-backend.herokuapp.com/

# Youtube watch-together Browser Extension


## Quick Demo
https://user-images.githubusercontent.com/43687545/186533702-67a3f661-f4bf-4fe2-ba6b-6e85532a5586.mp4

## Overview
This is a google extension that seeks to allow online users to watch Youtube videos together directly in the Chrome browser with minimal effort and through a simple and, at times, invisible browser extension.

## How it works
Once the extension is installed, the main content script of the extension will be injected into any web page which contains the "google.com" domain name. This can be done by searching something into the chrome browser. After that, the user can open the popup and will be prompted to request a User ID(which is a randomly generated string that the backend uses to keep track of users) which will be served by the backend. Then, the user has 2 options:
  - If the user opts to create a room, then the backend will create a watch room and assign it a room number(digit/number) and a Room ID. At this point,       the user(s) in the room can request that everyone in the room(including themselves) start watching a Youtube video by providing the link to the pop-up.     After the link is provided, each users’ extension will open that video in a separate tab and now the users can control everyone’s video.
  - If the user opts to join a room, they will have to provide both the room number and room id as a verification protocol to ensure they want to connect       to the right room. If these 2 keys are valid, then the user will be added to the room.

Once the users' extensions opened the specified youtube video, each user in the room can control everyone's videos in 2 ways.
  - They can pause and play the video by clicking on their own youtube video window.
  - They can change the time in the video by clicking on their own video time bar.

*Users can also pause and play their own video without echoing this action to the other users. This can be done by using the play/pause buttons in the left bottom corner of a youtube video.*

Users can also opt to leave a room if they are in one, and join or create another room.

## Technologies used
For the extension portion of the project I used the Chrome API and for the backend I used the npm **ws** module. 

## How to install
The official working version of the extension is in the webpage_socket branch of the repo.
Due to multiple bugs in the Chrome API, and unavailability of the Manifest V3 on latest stable versions of the Chrome browser, I had to find a Chrome version where all these parts worked. I used Chromium Version 93.0.4557.0 (Developer Build) (64-bit) and almost everything worked smoothly. To install the extension, open the browser and go to "chrome://extensions/", enable Developer mode then upload the "extension" folder by clicking on Load unpacked and navigating to the folder.

## Improvements
#### Joining the toom tate
If a user wants to join a room which has already opened a Youtube video, they should be able to do this without having to be in the room before the video was opened.

#### Multiple videos in the same room
Right now users in a room can only watch one video together. If they wanted to watch another video, they would have to set up another room.

# Indaba Transcription

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

This is a React App for Transcribing Indaba Story's that is integrated\
into Indaba. The Transcription process is broken down into three steps:
1. Chunking
2. Transcribing
3. Reviewing

### Chunking:

Chunking consists of breaking the video up into 'Chunks'. The goal of this\
step is to make transcribing more manageable and scalable - the various chunks\
are easier to transcribe because they are much smaller than the entire video,\
and the process is more scalable because different users can be transcribing\
different chunks at the same time.

### Transcribing:

The user is presented with the chunks created in step 1, one at a time.\
Each chunk is presented a series of smaller, 5 second long chunks that loop\
automatically. This makes the process of transcription as easy as possible - \
taking away to mental load of remembering where in the video the user is currently,\
they can focus entirely on transcribing the content of the video.\
The video automatically pauses when the user types and resumes when they stop typing. \
Ideally, multiple users transcribe each chunk.

### Reviewing:

In this step one user is presented with each chunk, along with all the various users'\
transcriptions for that chunk.\
The review process consists of going through each chunk, selecting the most
appropriate/accurate transcription, and editing transcriptions where necessary.\
The selected transcriptions will be used in the final transcription.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

The app will fail if it is run this way as the logic for fetching the Ourstory API\
key relies on fetching the API key from the URL passed from the main part of\
Indaba. You can work around this by hardcoding an API key and Edit ID (The Edit\
ID is also fetched from the url). Search the project for calls to `window.location.href`\
to find the logic that needs to be replaced with hardcoded values.

### `npm run test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The main portion of Indaba serves `build/index.html`, so when you run this\
command, you can access the built app from the main Indaba app.
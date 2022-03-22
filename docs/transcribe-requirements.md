# Transcribe Requirements

## Overview

'Transcribe' is an extension to the **Indaba** web application that facilitates
the transcription of community videos (or 'Shoots').

This document details the scope, motivation and specifications of the transcription portion of the **Indaba** web application.

## Purpose

---

**Indaba** is a web application for creating community videos. **Indaba** aims
to allow users to quickly and easily create videos that can be shared
within and between communities.

The various communities accessing these videos do not necessarily speak the
same language. Thus, it is important that a transcript is
created to accompany each community video, so that the video can be translated
and annotated with subtitles.

This transcript serves to allow end viewers from various linguistic 
backgrounds consume the community videos created by the app.

So, the purpose of the 'Transcribe' extension to **Indaba** is to facilitate
the transcription of videos created within **Indaba**.

## Technology

---

End users of **Indaba** will only have access to Android tablets and a single
server serving the **Indaba - Titan** web application. This means that
the transcription framework must be standalone (i.e. not require the use of
the internet).

End users will access the application through an 11" Android Tablet,
so the design of the system aims to accomodate this form factor.

The 'Transcribe' extension will be built using *React* and *Typescript*.

## Workflow

---

The transcribing of videos is one of the last parts of the process of creating
community videos. Hence, when transcription takes place, end users will have
access to the final edit of the video they are transcribing.

The transcription workflow videos consists of three steps:
 - Chunking
 - Transcription
 - Reviewing

### Chunking

The video being transcribed is separated into chunks, where each chunk is made
up of a single person talking. This serves to break down the video into
smaller, reasonably sized chunks, that can each be transcribed individually.

### Transcription

Each chunk is transcribed as a standalone video. This can be done by multiple
users concurrently. Ideally, each chunk would be transcribed by multiple users
so that mistakes are minimised.

### Reviewing

The transcriptions are reviewed, and in cases where multiple transcriptions
have been created for the one video, conflicts are resolved.

---

## Current Implementation

Currently, the Transcribe extension is implemented as 3 standalone *React*
web applications. In the final implementation, the extension will be a
standalone *React* web application.

### Planned Design Changes

Currently, when transcribing, the user is presented with a list of timestamps,
each of which correspond to a chunk that was created in the the **Chunking**
step, as well as the video, in it's entirety.

In the final implementation, the video will be presented one chunk at a time,
rather than in it's entirety, and users will be able to translate
just that chunk, before moving onto the next chunk.

## Data Model

Storys are stored in the **Edit** model. The **Edit** model has an attribue
**"transcriptions"** which stores all the data for the transcription of that
Story.

Currently, the transcription attribute has only one child: **chunks**.

The chunks attribute is an array of 'chunk' objects:
- a *startime*
- an *endtime*
- a *creatorid*
- a *contributions* array of 'contribution' objects:
  - a *user*
  - a *text* (The text for that transcription)

<br/>
<br/>

---
## Note: I propose adding a uuid (or at least an ID) for each chunk object
---
<br/>
<br/>

# Requirements

1. As a user, I want to be able to Transcribe any finished 'Story' my account
   has access to

   - In **Indaba**, from the list of Stories, completed stories have a
     'Transcribe' option
   - Selecting 'Transcribe' opens the Transcribe extension of **Indaba**.

2. As a user, I want to be able to enter my name before I begin transcribing,
   so that any transcriptions I make can be traced back to me during review

   - Once a user has selected the Transcribe option for a Story, if they
     have not yet specified their name, a dialogue will prompt them to
     enter their name
   - An option to change the name of the current user is present throughout
     the transcription process

3. As a user, I want to be able to easily see the status of a Story's
   transcription, so I know how much work needs to be done

   - The main page of the Transcription extension shows what percentage of
     each step of the transcription has been completed
   - Along with the progress of each step is a link to perform each step

4. As a user, I want to be able to easily split the video into chunks,
   so that the video can be transcribed in digestible chunks, rather
   than one long video

   - From the main page, selecting the link to 'Chunking' presents the user
     with an interface for splitting the video into chunks
   - The main portion of the interface is the video being split
   - The interface also comprises of a button for going back in the video,
     a button for creating a chunk, and a list of chunks

5. As a user, I want to be able to freely and dynamically interact with the
   video, so that I can relisten to any parts that I need to

   - The video player in the chunking interface can be played, paused and
     scrobbled through

6. As a user, I want to be able to quickly and easily rewatch the last 5
   seconds of the video, to relisten to a part that I may have misheard

   - The chunking interface has a button for going back 5 seconds in the video

7. As a user, I want to be able to create a new chunk in the video with a
   single button, so that it is easy and intuitive to create chunks

   - The chunking interface has a clearly labelled button to create chunks
     in the video
   - Pressing the button marks the end of a persons dialogue
   - Pressing the button in the middle of an already created chunk splits
     that chunk into two chunks

8. As a user, I would like to see a list of chunks I have created so far,
   so that I can quickly rewatch or delete chunks

   - The chunking interface has a horizontally scrolling list of elements
     representing chunks in the video
   - Each list item has a delete and a play button
   - When a chunk is played, the player highlights the chunk in the progress
     bar, and automatically pauses at the end of the chunk
   - Deleting a chunk appropriately merges chunks on either side

9. As a user, I want to be able to begin transcribing chunks once I have
   completed chunking a video

   - Once a video has been completely broken down into chunks, the link to
     the second step becomes available on the main transcription page
     
10. As a user, I want to be able to transcribe chunks concurrently with other
    users

    - Transcription of chunks can be done concurrently by multiple users

11. As a user, I want to be able to review the chunks I am transcribing one
    at a time, so that I can focus on transcribing just that chunk

    - During the transcription step, chunks are presented one at a time,
      each as a standalone video
    - The video for each chunk is fully play/pausable and scrubbable
    - The transcription interface allows users to navigate through chunks to
      make changes to previous chunks' transcriptions

12. As a user, at any time during transcribing, I want to be able to begin work
    on the review step

    - Once there are transcribed chunks to be reviewed, the link to the review
      step becomes active
    - Selecting the Review link presents the review interface
    - In the review interface, each chunk is presented one at a time, along
      with the transcriptions that have been completed for that chunk
    - Users select from the list of transcriptions for that chunk, the best 
      (most accurate) transcription
    - Each transcription is accompanied by the name of the author
    - Once a transcription has been selected from the list, it can be edited to
      fix any final errors

13. As a user, I want the system to auto-generate .vtt files for my videos, so
    that I can watch the video with subtitles

    - Once the Review process is completed, a .vtt file is created for
      subtitles
    - Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
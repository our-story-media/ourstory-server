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
created to accompany each community video.

This transcript serves to allow end viewers from various linguistic 
backgrounds consume the community videos created by the app.

So, the purpose of the 'Transcribe' extension to **Indaba** is to facilitate
the transcription of videos created within **Indaba**.

## Technology

---

End users of **Indaba** will only have access to Android tablets and a single
server serving the **Indaba - Titan** web application. This means that
the transcription framework must be standalone (i.e. not require the use of
the internet)

The 'Transcribe' extension will be built using *Typescript* and *React*.

## Workflow

---

The transcribing of videos is one of the last parts of the process of creating
community videos. Hence, when transcription takes place, end users will have
access to the final edit of the vidoe they are transcribing.

The workflow of transcribing videos consists of three steps:
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

**Chunking**

**NOTE**: The following may be an unnessary design change that overcomplicates the
interface of the system; this change may require further consideration

Instead of a list of elements that describe the chunks created so far,
the scroll bar will be coloured/segmented to visualise the chunks created.
So, for the edge of each chunk, there will be a scrollable element, and
the segments will be alternating in colour. When an element is scrolled,
the video scrolls to that point in the video.

**Transcription**

Currently, when transcribing, the user is presented with a list of timestamps,
each of which correspond to a chunk that was created in the the **Chunking**
step, as well as the video, in it's entirety.

In the final implementation, the video will be presented one chunk at a time,
rather than in it's entirety, and users will be able to translate just that
chunk, before moving onto the next chunk.
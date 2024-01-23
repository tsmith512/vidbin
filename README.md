# vidbin

## Functionality Demonstrated

## Architecture Overview

## Database Schema

I thought about doing this without any storage app-side and leaving it all to
Stream, but I wanted to enable these things:

- A shorter URL than the full Stream video ID
- Making sure that the app would only show videos created through it
- Knowing the state of a video without having to look it up each time
- Demonstrating common advice I give to prospects/customers, that there are
  uses in maintaining a map between the Stream video and custom data.

``` sql

CREATE TABLE videos (
    id                INTEGER PRIMARY KEY AUTOINCREMENT
                              NOT NULL,
    video_id          TEXT    UNIQUE
                              NOT NULL,
    endpoint          TEXT,
    name              TEXT,
    created           TEXT,
    status            TEXT,
    scheduledDeletion TEXT
);

```

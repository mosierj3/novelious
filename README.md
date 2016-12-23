#Novelius

##Summary
Novelius is a project I started working on last year. The goal is to create a place for people who like writing to connect with other writers for ideas, feedback, and just to be a part of a community. For people who aren't really into writing, or maybe just need some inspiration, there is a "Reading" section where anyone can come and read all published stories from the contributers. The idea there, is that a reader could subscribe to a certain writer, and when the writer publishes a chapter to a story in development, all members subsribed to that writer would recieve a notification and be able to read the new chapter. In this way, a member could read any writers work (that chooses to publish) as they write it. Ideally, this provides motivation to keep writing, and for the readers, it provides stories in segments, similar to literary podcasts, or even television.

##Current progress
- Users can make an account, or login.
- Users can login/signup using Google, on local develoment only, not sure why.
- Writer module works, including writing a story, saving/deleting/moving chapters, chapter publishing/unpublishing.
- Some basic UI design, mostly from default Bootstrap CSS.
- Reader module exists... that's about it.
- Reviewing module also exists.

##Goals

###Writer Module:
- [ ] Add ability to see highlights and comments with accurate context. This can't really be accomplished until after finishing the Reviewer Module.
- [ ] Add categories.
- [ ] Some UI changes to make readable on mobile.
- [ ] Make Writer main page, which shows all currently existing stories, with ability to add new story, or see comments/suggestiongs.

###Reader Module:
- [ ] View available contributers.
 - Should only show contributers with published content.
- [ ] Subscribe to contributers.
 - Requires adding db fields for contributers associated with each user.
- [ ] View available published content from subscribed to contributers.
- [ ] Edit options for new content notifications.
- [ ] Rate and comment on stories (not on specific paragraphs, sentances, etc.).
- [ ] Currated content:
 - Most recently published content from contributers to which subscribers are subscribed to.
 - Most popular published content.
 - Editor's picks.
- [ ] Content search.
- [ ] Open and read stories.
- [ ] Highlight passages in stories.

###Notification Module:
- [ ] Make notification module
- [ ] Alert subscribers when new content is published by one of their subscribed contributers, based on notification options.

###Reviewer Module:
- [ ] Hide review module to non-contributing users.
- [ ] Show all contributers to which user is subscribed to.
- [ ] Open specific stories, similar to Writer module, but with added ability to comment specific paragraphs, sentances, or words.

###General:
- [ ] Code clean-up.
- [ ] Graphics/UI redo.
- [ ] UI finisishing touches.

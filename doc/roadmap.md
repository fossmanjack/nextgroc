- [X] make ListItem into a class
- [O] implement button actions
	- [X] checkbox
	- [X] sweep item
	- [X] edit item
	- [X] add picture
- [ ] Figure out why formatting isn't working right
- [X] implement List class
- [ ] implement header
- [ ] implement footer
- [ ] implement sidebar

Understand that in order to get this to work correctly you're probably going to
need to use Node.js to interact with a sqlite database on the back end.  It's
probably possible to just use json files with webdav but this is a full-stack
dev course so we should probably plan to use the full stack, cu ne?

---

### Notes

I need to find out if JS can read from a directory so as to load each file found
there into a _Lists map with keys equal to the filename pointing to the data
read from each file.  Or, like, _State['lists'].

As an aside, does State need to be a map?  A prototype object would probably
work fine and be slightly easier to work with.  Probably less memory overhead
too.  Don't use a map if you don't have to, Jack.

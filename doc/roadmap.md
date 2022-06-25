- [X] make ListItem into a class
- [O] implement button actions
	- [X] checkbox
	- [X] sweep item
	- [X] edit item
	- [ ] add picture
- [ ] Figure out why formatting isn't working right
- [X] implement List class
- [ ] implement header
- [ ] implement footer
- [ ] implement sidebar
- [ ] implement help modals
- [ ] save lists with cookies for now

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

One option for the "list of lists" is to have it be its own JSON file, just
an array of file names.  Push comes to shove we store everything in a big JSON
file and load the lists as needed.  Well, probably an object or a map of lists.
Probably an object since that's what response.json() returns anyway.

Note: we don't need a separate "list" and "library" view really, just modes,
states, and hidden entries.  If we add a "hidden" or "nodisplay" class to the
DOM root element and change around the button functions, the thing should
disappear.

Oh!  Add color-changing pluses and minuses to btn0 in library mode instead of
the checkbox.  More intuitive.

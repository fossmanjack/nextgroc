1. _State contains all information about the state of the application
	- Available lists (loaded from localstorage for now)
	- Current view (list or pantry)
	- Modal states
	- App button functions
	- Settings
	- Current list
2. _State is immutable -- all functions that change state create a new state, and the old state is pushed to state history (?)
3. Are classes needed?  Can probably achieve everything with functions especially since I don't know how to bind
4. How are we doing syncing?  We have two choices: back-end database or flat json files synced with webDAV

We could leverage the fact that maps can have objects as their keys if we wanted to,
but there's also probably no good reason to not store whatever values we need in the
object props themselves.

I did just verify that if you store an object in a map (and presumably array or other object), the object and the stored representation both point to the same data and can be updated using either reference.

Actually I might want to use a map for the autocomplete, because it's ... no, no, I don't need to use a map for that, do I?

No, I just need to recode the autocomplete function to grab the titles from the object array and alphabetize them.

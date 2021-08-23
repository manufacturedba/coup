// About to eat some dinner - 5:20pm
// Okay I'm eating. Be back in 15? - 5:25pm
// Back early - let's get to making an actual game screen - 5:40pm
// Need to read up on how game events are triggered - 6:01pm
// Okay, I think I have figured out how to show only current
// player's cards - 6:05pm
// Turns out I have to assign player IDs myself... - 6:13pm
// I have player access completely figured out. Let's get to
// showing the current player's cards - 6:47pm
// Holy shit, we have a secret hand working - 7:08pm
// Let's make the board/cards look nicer - 7:33pm
// Let's create the action bar now - 7:47pm
// We have actions done. Let's tackle a basic income action flow - 8:23pm
// We need to disable actions if it's not the current player's turn - 8:26pm
// Income appears to be executing but some issues with interacting with game context. We also need to inform game that clicking this task will end the turn - 8:39pm
// Oooo, buttons should also be disabled based on the action's cost. Will fix that soon - 9:04pm
// HOLY SHIT IT WORKS - 9:14pm
// Let's focus real quick on button disable state before moving on - 9:17pm
// Assassinate is blocked so obviously it's functioning. Let's focus on hooking up foreign aid so we can complete the timed flow - 9:28pm
// Real quick, let's change "Current player" to "It's your turn" when ID matches
// Hmm, how the shit do we unblock the current player once they've been challenged? I think we'll need to store their desired action off to the side... - 9:47pm
// So move limit is also a problem.. Can't respond to challenges/blocks while it exists - 9:57pm
// Do you have to show the card you were challenged on if you have it? - 10:01pm
// "If they can't, or do not wish to, prove it, they lose the challenge. If they can, the challenger loses." - 10:01.5pm
// Turns out we don't want all information hidden. We need to know what bozo discarded - 10:05pm
// Okay, now you know who has died so far, back to the challenge/block flow - 10:24pm
// KK, seems like setting a timer for a block/challenge works fine. Let's actually do the "choose action as BLANK flow" - 11:06pm

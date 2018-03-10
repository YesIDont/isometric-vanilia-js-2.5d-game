# Soletaken
This is game based on tiles in isometric view.

Current features:
- pure HTML, CSS and JavaScript
- adjustable map size allowing to specify number of tiles
  horizontaly and verticaly (up to few milions tiles on map)
  depending on computer's strenght might by laggy
- map generator: random grass tiles, random tile level
- character movment with arrow keys: updates rendering tile offset
- character collision:
	- stage 1: at the loading of the map tile offset for sat collision is calculated which narrows down the amount of tiles to check
  	- stage 2: above collection of tiles is tested to see if they are on different level than player is
  	- stage 3: tiles on different level than player's character are put to SAT collision test 
- character generator function: generates character with all his stats (currently only speed and sprite)
- character's sprite animation function:
	- allows to chose continous loop animation or breathing animation
	- after getting sprite's size and number of frames horizontaly and verticaly calculates frame size
	- gets delay number telling how many frames to skip before displaying next frame
- map generator function:
	- allows to specify map and single tile size,
	- creates two dimensional array of tile bojects with x, y and z position
	  and number of other properties
  	- calculates tile offset for rendering area, allowing to rener only tiles visible on screen
  	- holds methods running on the map generation stage - generators
- full viewport animation for all devices
- auto adjust of vieport size after changing deivce position or resizing window (buggy)

Current demo:
http://monsterdesign.pl/soletaken/


To do:
- HTML UI
	- dev tools
	- fog of war!
	- game UI
		- player character stats
		- active pause

- controls
	- mouse control
	- mobile touch control
	- key bindings
	- 

- optimisation
	- unified render loop
	- compressed images
	- FPS control
	- partial screen image clean istead of cleanning all canvas layers before drawing next frame
	- 

- generators
	- terrain
		- land, island, flying island
		- terrain level
		- stones: small, huge, paile of rocks, big fuck of rocks
		- trees
		- grass
		- flowers
		- water: ponds, rivers, streams, lakes
	- buildings
		- well
		- ruins
		- 

- NPCs
	- monsters
	- lesser gods
	- gods
	- 

- graphics
	- shit load of tiles
	- light
	- sprites
	- static elements (buildings, etc)
	- 

- character generator
	- stats: dice roll for D&D 3.5 attributes
	- skills: not to many
	- trumps, flaws
	- looks
	- proffesion: soldier, mercenary, mage, druid, etc
	- 

- weather
	- rain
	- fog
	- 
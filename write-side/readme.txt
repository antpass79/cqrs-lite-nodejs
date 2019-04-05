mongodb
https://flaviocopes.com/node-mongodb/

generic repository
https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e

debugging steps with VSCode:
- define tasks with dependencies before debug in tasks.json (copyconfig -> build -> predebug)
- define the entry task in launch.json
- put your breakpoints on code
- show debug window
- run debug (it's not so fast to run)

IMPORTANT NOTE FOR DEBUGGING write-side:
you have to load only write-side folder, in which there is the .vscode subfolder with configuration files for debugging.
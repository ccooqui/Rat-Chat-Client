                                                                       .--,       .--,
                                                                      ( (  \.---./  ) )
                                                                       '.__/o   o\__.'
                                                                          {=  ^  =}
                                                                           >  -  <
                                                            ___________.""`-------`"".____________
                                                            /  o                            O      \
                                                            \                      o               /
                                                            /  .    O                          o   \
                                                            \         WELCOME TO RAT CHAT          /         __
                                                            /                                      \     _.-'  `.
                                                            \______________o__________o____________/ .-~^        `~--'
                                                                          ___)( )(___        `-.___.'
                                                                    jgs  (((__) (__)))

# Project Title
Rat Chat Client

## Main Components
The main components include functionality to connect to a web server given a address to the host, and to handle all events from the server
such as messages, and errors.

The user will also be able to set their user name, and to send messages to other users on the server that has been connnected to.

Rat Chat is also safe for users of all ages and includes a filter for inappropriate language.

## Installing and Use

`npm install`
`node chat.js`

It will ask for an address of the server you wish to connect to, type it out and press enter and the client will attempt to connect.
I should be in the format of `[address]:[port]`
Example of a attmpeting to connect to a server on port 4930 and address 10.226.9.220
`10.226.9.220:4930`

The user will then be able to enter a username, it must be alphanumeric and betwen 3-10 characters.

## Commands

Users have a variety of commands that they can use in the client and may be used by entering the following:
* \whoami: Allows the user to check their username
* \userlist: Allows the user to check all users currently on the server
* \direct {username}: Allows the user to direct message another user and then send any message that follows the command

## Built With

* [ws](https://github.com/websockets/ws) - Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js
* [Readline](https://nodejs.org/api/readline.html) - Allows program to read and write to terminal.
* [fs](https://www.npmjs.com/package/file-system) - Reads and writes to files.
* [Chalk](https://www.npmjs.com/package/chal) - Allows for styling of messages sent to the console.






/** MMOHandler.js
 * Handles the connection and communication with the MMO server.
 * Manages player states and interactions in the MMO environment.
 * 
 * Usage:
 * const mmoHandler = new MMOHandler('roomname');
 * mmoHandler.connect(); // Establish WebSocket connection
 * mmoHandler.updatePlayer({ ... }); // Sends the playerData to the server and updates the local player state.
 *   + The id of the local player is inserted automatically if not specified.
 *   + The type of the message is set to 'player:state' if not specified.
 * mmoHandler.disconnect(); // Close WebSocket connection
 */

export default class MMOHandler {
    constructor(roomname) {
        this.host = 'vibescale.benallfree.com';
        this.roomname = roomname; // Room name for the MMO connection
        this.websocket = null; // WebSocket connection
        this.debug = true; // Enable debug mode for logging

        this.players = {}; // Store players by their IDs
        this.localPlayerId = null; // Store the local player's ID

        
        this.callbackPlayerState = null; // Callback for player updates
    }

    getWebsocketURL() {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        return `${protocol}://${this.host}/${this.roomname}/websocket`;
    }

    connect() {
        this.websocket = new WebSocket(this.getWebsocketURL());

        this.websocket.onopen = () => {
            this.log('WebSocket connection established');
        };

        this.websocket.onmessage = (event) => {
            this.handleMessage(event.data);
        };

        this.websocket.onclose = () => {
            this.log('WebSocket connection closed');
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        this.websocket.close();
        this.log('WebSocket disconnect initiated');
        this.players = {};
        this.localPlayerId = null;
    }

    updatePlayer(playerData) {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open. Cannot send playerData:', playerData);
            return;
        }
        if(!playerData || typeof playerData !== 'object') {
            console.error('Invalid playerData format. Must be an object:', playerData);
            return;
        }
        
        if(!playerData.type) {
            playerData.type = 'player:state'; // Default message type if not specified
        }
        if(!playerData.id) {
            playerData.id = this.localPlayerId || 'unknown'; // Default ID if not specified
        }
        this.players[playerData.id] = playerData; // Update or add the local player data
        let messageText = JSON.stringify(playerData);
        this.log('Sending message:', messageText);
        this.websocket.send(messageText);
    }

    handleMessage(message) {
        console.log('Received message:', message);
        const playerData = JSON.parse(event.data);
        switch (playerData.type) {
            case 'player:state':
                this.players[playerData.id] = playerData; // Store or update player state
                if(playerData.isLocal) {
                    this.localPlayerId = playerData.id; // Store the local player's ID
                    this.log('Local player ID set:', this.localPlayerId);
                }
                if(playerData.isConnected === false) {
                    delete this.players[playerData.id]; // Remove disconnected player
                    this.log('Player disconnected:', playerData.id);
                }
                if(this.callbackPlayerState) {
                    this.callbackPlayerState(playerData); // Call the update listener if registered
                }
                break;
            default:
                console.error('Unknown message type:', playerData.type);
        }
    }

    registerUpdateListener(callbackPlayerState) {
        this.callbackPlayerState = callbackPlayerState;
    }

    log(...logArgs) {
        if (!this.debug) {
            return;
        }
        console.log(...logArgs);
    }

}

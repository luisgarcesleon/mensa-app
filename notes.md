# notes

* OPTIMIZE! Broadcast push/remove events on update instead of whole list to avoid sending huge payloads and slowing everything down.

## client

* FIXED disconnecting and connecting to server leaves socket.once('ready') event listener left which calls setupPing(). The use of setTimeout makes the duplicate disappear after first ping.
* FIXED also listening to same event in Join.tsx when debug is true leading to toast error. when debug turned off there is no longer an error.
* ping timeout does not clear because all listeners are removed before disconnect (and disconnect event dispatch) leading to client sending ping packet when disconnected.

## server

* FIXED remove client from speak list on disconnect
//Inspired by https://medium.com/@willrigsbee/how-to-keep-track-of-clients-with-websockets-1a018c23bbfc

class Rooms {
  constructor() {
    this.rooms = [];
    this.room_index = 0;
    this.saveRoom = this.saveRoom.bind(this);
  }

  saveRoom(room_uuid, client, client_uuid) {
    this.rooms.push({
        room_uuid: room_uuid,
        room_number: this.room_index,
        clients: [
          {
            socket: client,
            client_uuid: client_uuid
          }
        ]
    });
    this.room_index += 1;
  }

  getRoomNumber() {
    return this.room_index - 1;
  }

  iterateRooms() {
    this.rooms.forEach(room => {
      console.log(room)
    });
  }

  addUserToRoom(room_uuid, room_number, user_uuid, client) {
    if(this.rooms[room_number].room_uuid === room_uuid) {
      this.rooms[room_number].clients.push({
        socket: client,
        client_uuid: user_uuid
      });
      this.sendToClients(room_number, room_uuid, JSON.stringify({
        type: "added to room",
        user_uuid: user_uuid,
        room_uuid: room_uuid,
        room_number: room_number
      }));
    }
  }

  sendToClients(room_number, room_uuid, msg) {
    if(this.rooms[room_number].room_uuid === room_uuid) {
      this.rooms[room_number].clients.forEach(c => {
        console.log("sending to " + c.client_uuid);
        if(c.socket) {
          c.socket.send(msg)
        }
      });
    } else {
      console.log("room number and uuid not matching");
    }
  }

  removeClientFromRoom(user_uuid, room_uuid, room_number) {
    let index = 0;
    this.rooms[room_number].clients.forEach(socket => {
      if(socket.client_uuid === user_uuid) {
        socket.socket = undefined;
      }
      index += 1;
    });
    if(this.rooms[room_number].clients.length == 0) {
      this.rooms[room_number] = {};
    }
    this.iterateRooms();
  }
}

module.exports = Rooms;
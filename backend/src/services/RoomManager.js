import {randomUUID} from "crypto";

class RoomManager{
    constructor(){
        this.rooms = new Map();
    }

   createRoom(hostId, username, videoId = null) {
  const roomId = randomUUID().slice(0, 6);

  const room = {
    roomId,
    hostId,
    videoId,
    playbackState: "paused",
    currentTime: 0,

    participants: [
      {
        userId: hostId,
        username,
        role: "host",
      },
    ],
  };

  this.rooms.set(roomId, room);

  return room;
}

    //get room
    getRoom(roomId){
        return this.rooms.get(roomId);
    }

    //delete room
    deleteRoom(roomId){
        return this.rooms.delete(roomId);
    }

    //add participant
    addParticipant(roomId,userId,username){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        const participant = {
            userId,
            username,
            role:"participant",
        };

        room.participants.push(participant);

        return participant;
    }

    //remove participant 
    removeParticipant(roomId,userId){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        const index = room.participants.findIndex(
            (participant) => participant.userId === userId
        );

        if(index === -1){
            return null;
        }

        const [removeParticipant] = room.participants.splice(index,1);

        return removeParticipant;
    }

    //get participant

    getParticipant(roomId,userId){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        return room.participants.find(
            (participant) => participant.userId === userId
        );
    }

    //update participant role
    updateRole(roomId,userId,role){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        const participant = room.participants.find(
            (participant) => participant.userId === userId
        );

        if(!participant){
            return null;
        }

        participant.role = role;

        return participant;
    }

    //update playback state
    updatePlayback(roomId,playbackState,currentTime){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        room.playbackState = playbackState;
        room.currentTime = currentTime;

        return room;
    }

    //update video
    updateVideo(roomId,videoId){
        const room = this.rooms.get(roomId);

        if(!room){
            return null;
        }

        room.videoId = videoId;
        room.playbackState = "paused";
        room.currentTime = 0;

        return room;
    }
}

export default RoomManager;
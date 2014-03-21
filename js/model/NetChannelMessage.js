/**
 File:
 NetChannelMessage.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 A common class for sending messages between ServerNetChannel / ClientNetChannel
 It is a small value-object wrapper which contains a sequence number and clientid
 Basic Usage:
 // Create the data that will live in the message
 var command = {};
 // Fill in the data
 command.cmd = aCommandConstant;
 command.data = {x:1, y:1};

 // Create the message
 var message = new Message(this.outgoingSequence, true, command)

 // Send the message (can happen later on)
 message.messageTime = this.realTime; // Store to determin latency

 (from netchannel)
 this.connection.send(message.encodedSelf());
 };
 */
(function () {

    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

    /**
     * Creates a NetChannelMessage
     * @param aSequenceNumber        A sequence number, used to track messages between server / client
     * @param isReliable            A message is 'reliable' if it must be sent, for example fireweapon / disconnect. It is 'unreliable', if it can be overwritten with newer data, i.e. currentPosition
     * @param aPayload                The message to send
     */
        //var message = new RealtimeMultiplayerGame.model.NetChannelMessage( this.outgoingSequenceNumber, this.clientID, isReliable, aCommandConstant, payload );
    RealtimeMultiplayerGame.model.NetChannelMessage = function (aSequenceNumber, aClientid, isReliable, aCommandType, aPayload) {
        // Info
        this.seq = aSequenceNumber;
        this.id = aClientid; 					// Server gives us one when we first  connect to it
        this.cmd = aCommandType;

        // Data
        this.payload = aPayload;

        // State
        this.messageTime = -1;
        this.isReliable = isReliable;
    };

    RealtimeMultiplayerGame.model.NetChannelMessage.prototype = {
        // This message MUST be sent if it is 'reliable' (Connect / Disconnect).
        // If not it can be overwritten by newer messages (for example moving is unreliable, because once it's outdates its worthless if new information exist)
        isReliable: false,
        cmd: 0,
        aPayload: null,
        seq: -1,
        id: -1,
        messageTime: -1,

        /**
         * Wrap the message with useful information before sending, optional BiSON or something can be used to compress the message
         */
        encodeSelf: function () {
            if (this.id == -1) {
                console.log("(Message) Sending message without clientid. Note this is ok, if it's the first message to the server.");
            }

            if (this.messageTime == -1) {
                console.log("(Message) Sending message without messageTime. Expected result is undefined");
            }

            return {id: this.clientid, seq: this.sequenceNumber, cmds: this.unencodedMessage, t: this.messageTime}
        }
    }
})()
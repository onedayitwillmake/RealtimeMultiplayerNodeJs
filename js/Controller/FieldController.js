(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Controller");

	RealtimeMultiplayerGame.Controller.FieldController = function() {
		this.entities = new SortedLookupTable();
		this.players = new SortedLookupTable();
	};

	RealtimeMultiplayerGame.Controller.FieldController.prototype = {
		view									: null,					// FieldView
		entities								: null,					// A SortedLookupTable for all entities
		players									: null,					// A SortedLookupTable for players only, stored using client.getSessionId()


		// Will be called on client side
		setupView: function() {
			this.view = new RealtimeMultiplayerGame.View.FieldView();
		},

		/**
		 * Update all entities
		 * @param {Number} speedFactor	A number signifying how much faster or slower we are moving than the target framerate
		 * @param {Number} gameClock	Current game time in seconds (zero based)
		 * @param {Number} gameTick		Current game tick (incrimented each frame)
		 */
		tick: function(speedFactor, gameClock, gameTick)
		{
			// Update entities
			this.entities.forEach( function(key, entity){
				entity.tick(speedFactor, gameClock, gameTick);
			}, this );

			this.rankPlayers();
		},

		/**
		 * Allow to arbitrarily rank players.
		 * Left in as example, however it is not implemented in framework for you
		 */
		rankPlayers: function() {
			return;

			// Rank players
			this.playersArray.sort(function(a, b) {
				var comparisonResult = 0;
				if(a.score < b.score) comparisonResult = 1;
				else if(a.score > b.score) comparisonResult = -1;
				return comparisonResult;
			});

			// Set the players rank to the their index in the sorted array
			var len = this.playersArray.length;
			for(var i = 0; i < len; i++)
				this.playersArray[i].rank = i+1;
		},

		/**
		 * Updates the entity based on new information (called by AbstractClientGame::renderAtTime)
		 * @param {int}		objectID  	ObjectID we want to update
		 * @param {Vector}	newPosition	position
		 * @param {Number}	newRotation	rotation
		 * @param {EntityDescription}	entityDesc	An object containing new properties for this entity
		 */
		updateEntity: function( objectID, newPosition, newRotation, entityDesc ) {
			var entity = this.entities.objectForKey( objectID );

			if( entity != null ) {
				entity.position.x = newPosition.x;
				entity.position.y = newPosition.y;
				entity.rotation = newRotation;

//				entity.themeMask = entityDesc.themeMask;
//
//				(entityDesc.nickname && (entity.model.nickname = entityDesc.nickname));
//				// Set if sent
//				(entityDesc.theme && (entity.theme = entityDesc.theme));
//				(entityDesc.score && (entity.score = entityDesc.score));
			} else {
				console.log("(FieldController)::updateEntity - Error: Cannot find entity with objectID", objectID);
			}
		},

///// Memory
		/**
		 * Remove a player.
		 * Does player stuff, then calls removeEntity.
		 * @param sessionId	ConnectionID of the player who jumped out of the game
		 */
		removePlayer: function( sessionId )
		{
			var player = this.players.objectForKey(sessionId);

			if(!player) {
				console.log("(FieldController), No 'Character' with connectionID " + connectionID + " ignoring...");
				return;
			}

			this.removeEntity( player.objectID );
			this.players.remove(player.sessionId);
		},


		/**
		 * Removes an entity by it's ID
		 * @param objectID
		 */
		removeEntity: function( objectID )
		{
			var entity = this.entities.objectForKey( objectID );

			if( this.view )
				this.view.removeEntity( entity.view );

			entity.dealloc();
			this.entities.remove( objectID );
		},

		/**
		 * Checks an array of "active entities", against the existing ones.
		 * It's used to remove entities that expired in between two updates
		 * @param activeEntities
		 */
		removeExpiredEntities: function( activeEntities )
		{
			var entityKeysArray = this.entities._keys,
			i = entityKeysArray.length,
			key;
			var totalRemoved = 0;

			while (i--)
			{
				key = entityKeysArray[i];

				// This entity is still active. Move along.
				if( activeEntities[key] )
					continue;

				// This entity is not active, check if it belongs to the server
				var entity = this.entities.objectForKey(key);

//				if(entity.clientID == 0)  {
//					continue;
//				}

				if( GAMECONFIG.ENTITY_MODEL.ENTITY_MAP.CHARACTER == entity.entityType ) {
					this.removePlayer( entity.clientID );
				} else {
					// Is not active, and does not belong to the server
					this.removeEntity(key);
				}

				totalRemoved++;
			}

		},

		dealloc: function()
		{
			this.isDeallocated = true;

			this.players.forEach( function(key, entity){
				this.removePlayer(entity.sessionId);
			}, this );

			this.entities.forEach( function(key, entity){
				this.removeEntity(entity.objectID);
			}, this );


			this.entities.dealloc();
			this.players.dealloc();

			if(this.view) this.view.dealloc();

			delete this.view;
			delete this.players;
			delete this.entities;
		},

///// Accessors
		getView: function (){ return this.view }
	};
})();
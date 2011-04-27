(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Controller");

	RealtimeMultiplayerGame.Controller.FieldController = function() {
		this.entities = new SortedLookupTable();
		this.players = new SortedLookupTable();
	};

	RealtimeMultiplayerGame.Controller.FieldController.prototype = {
		entities								: null,					// A SortedLookupTable for all entities
		players									: null,					// A SortedLookupTable for players only, stored using client.getSessionId()

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
		},

		/**
		 * Internal function. Adds an entity to our collection, and adds it to the view if we have one
		 * @param anEntity	An entity to add, should already be created and contain a unique entityid
		 */
		addEntity: function(anEntity)
		{
			this.entities.setObjectForKey( anEntity, anEntity.entityid );

			// If we have a view, then add the player to it
			if( this.view ) {
				this.view.addEntity( anEntity.getView() );
			}

		},

		/**
		 * Updates the entity based on new information (called by AbstractClientGame::renderAtTime)
		 * @param {int}		entityid  	entityid we want to update
		 * @param {RealtimeMultiplayerGame.model.Point}	newPosition	position
		 * @param {Number}	newRotation	rotation
		 */
		updateEntity: function( entityid, newPosition, newRotation ) {
			var entity = this.entities.objectForKey( entityid );

			if( entity != null ) {
				entity.position.x = newPosition.x;
				entity.position.y = newPosition.y;
				entity.rotation = newRotation;
			} else {
				console.log("(FieldController)::updateEntity - Error: Cannot find entity with entityid", entityid);
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

			this.removeEntity( player.entityid );
			this.players.remove(player.sessionId);
		},


		/**
		 * Removes an entity by it's ID
		 * @param entityid
		 */
		removeEntity: function( entityid )
		{
			var entity = this.entities.objectForKey( entityid );

			if( this.view )
				this.view.removeEntity( entity.view );

			entity.dealloc();
			this.entities.remove( entityid );
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

//				if(entity.clientid == 0)  {
//					continue;
//				}

				if( GAMECONFIG.ENTITY_MODEL.ENTITY_MAP.CHARACTER == entity.entityType ) {
					this.removePlayer( entity.clientid );
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
				this.removeEntity(entity.entityid);
			}, this );


			this.entities.dealloc();
			this.players.dealloc();

			this.view = null;

			delete this.view;
			delete this.players;
			delete this.entities;
		},

///// Accessors
		// Will be called on client side
		setView: function( aView ) {
			var theInterface = RealtimeMultiplayerGame.Controller.FieldControllerViewProtocol;
			for (var member in theInterface) {
				if ( (typeof aView[member] != typeof theInterface[member]) ) {
					console.log("object failed to implement interface member " + member);
					return false;
				}
			}

			// Checks passed
			this.view = aView;
		},
		getView: function (){ return this.view },
		getEntities: function() { return this.entities },
		getEntityWithid: function( anEntityid ) { return this.entities.objectForKey(anEntityid); }
	};

	/**
	 * Required methods for the FieldControllerView delegate
	 */
	RealtimeMultiplayerGame.Controller.FieldControllerViewProtocol = {
		addEntity: function( anEntityView ) {},
		dealloc: function() {}
	}
})();
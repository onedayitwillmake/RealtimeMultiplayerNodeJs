RealtimeMultiplayerGame = (typeof RealtimeMultiplayerGame === 'undefined') ? {} : RealtimeMultiplayerGame;
RealtimeMultiplayerGame.namespace = function(ns_string)
{
	var parts = ns_string.split('.'),
		parent = RealtimeMultiplayerGame,
		i = 0;

	// strip redundant leading global
	if (parts[0] === "RealtimeMultiplayerGame") {
		parts = parts.slice(1);
	}

	var len = parts.length,
		aPackage = null;
	for (i = 0; i < len; i += 1) {
		var singlePart = parts[i];
		// create a property if it doesn't exist
		if (typeof parent[singlePart] === "undefined") {
		   parent[singlePart] = {};
		}
		parent = parent[singlePart];

	}
	return parent;
};

if (typeof window === 'undefined') {

} else {

}

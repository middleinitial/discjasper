var kanye = [{id: "WibQR0tQ0P8", time: "183", title: "Kanye West - Only One ft. Paul McCartney"},
			{id: "hsgx7ZPSrfQ", time: "318", title: "Hold My Liquor - Kanye West (Yeezus)"},
			{id: "xnrLXDYnS6c", time: "158", title: "KanYe West - On Sight - Yeezus [Explicit Version]"}];


exports.setPlaylist = function(playlist) {
	
	plist = [];
	switch(playlist) {
		case 'kanye':
			plist = kanye;
			break;
		default:
			plist = [];
	}
	
	if(plist.length == 0) {
		console.log('Could not find playlist ' + playlist);
	}else {
		console.log('You have selected ' +playlist +' as your default playlist');
	}
	return plist;
}
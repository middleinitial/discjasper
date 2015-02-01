var kanye = [{id: "0f3vUML1qo4", time: "284", title: "Kanye West - Only One ft. Paul McCartney"},
			{id: "hsgx7ZPSrfQ", time: "318", title: "Kanye West - Hold My Liquor"},
			{id: "xnrLXDYnS6c", time: "158", title: "Kanye West - On Sight"},
			{id: "0yJuXCiiBSs", time: "294", title: "Kanye West - Power"},
			{id: "D0QcxWPB59o", time: "350", title: "Kanye West - Blood On The Leaves"},
			{id: "Vkioh25AoCU", time: "191", title: "Kanye West - Street Lights"},
			{id: "BJJQJy6mHSA", time: "255", title: "Kanye West - The Glory"},
			{id: "C6CJQ_hnm24", time: "548", title: "Kanye West - Runaway"},
			{id: "ofaRvNOV4SI", time: "259", title: "Kanye West - Lost In the World"},
			{id: "HAfFfqiYLp0", time: "328", title: "Kanye West - All of the Lights"},
			{id: "N29WWcLmgzQ", time: "286", title: "Kanye West - Dark Fantasy"},
			{id: "jZKWoJPM8Zw", time: "281", title: "Kanye West - Paranoid"},
			{id: "E58qLXBfLrs", time: "272", title: "Kanye West - Can't Tell Me Nothing"},
			{id: "F8kvRUuyEu8", time: "199", title: "Kanye West - Celebration"},
			{id: "wMH0e8kIZtE", time: "271", title: "Kanye West - Welcome to Heartbreak"},
			{id: "u6fgwqrS48I", time: "209", title: "Kanye West - Homecoming"}];
			
			

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
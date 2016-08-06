(function() {
	var url = 'http://nethive.info:8080/nrs/post/';
	var nicoUrlPattern = 'http://www.nicovideo.jp/watch/';
	var pageUrl = location.href;

	// gets video ID.
	var urls = pageUrl.split('/');
	var videoId = urls[urls.length - 1];

	if (!pageUrl.match(nicoUrlPattern)) {
		alert('(゜)(゜)彡 ニコニコのページじゃないやんけ！');
		return;
	}

	// gets username from cookie.
	var username = '';
	var cookieName = 'slackUsername';
	var allcookies = document.cookie;
	var position = allcookies.indexOf(cookieName);
	if( position != -1 ) {
		var startIndex = position + cookieName.length;

		var endIndex = allcookies.indexOf( ';', startIndex );
		if( endIndex == -1 ) {
			endIndex = allcookies.length;
		}
		
		username = decodeURIComponent(allcookies.substring(startIndex + 1, endIndex ));
	}

	if (username == '') {
		username = document.getElementById('siteHeaderUserNickNameContainer').innerText;
	}

	// sets username.
	var result = '';
	while(result == '') {
		result = window.prompt('(゜)(゜)彡 Slackに投稿する時の名前を入力するやで\n投稿しない場合はキャンセルや', username);

		if (result == '') {
			alert('()()彡 名前を入れてクレメンス…');
		}

		if (result == null) {
			alert('()()彡 あああああああああああああああああああああああああああ！');
			return;
		}
	}

	// stores username.
	document.cookie = 'slackUsername=' + encodeURIComponent(result);
	username = result;

	// make REST url
	url = url + username + '/' + videoId;

	// post nethive.info via xhr.
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				alert('(^)(^)彡 送信したやで');	
			} else {
				alert('()()彡 エラーが起きたやんけ…');
			}
		}
	}
	
	xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
	xhr.send();
})();
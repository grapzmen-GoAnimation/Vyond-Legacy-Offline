const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/player": {
			title = "Your Animation";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					thumbnailURL: "/movie_thumbs/${mId}.png",
					isEmbed: 1,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
	<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script>
		<link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
    <link rel="stylesheet" href="/html/css/video.css.gz.css">
    <script href="/html/js/common_combined.js.gz.js"></script>
	</head>
		<body style="margin:0px">
		<nav class="navbar site-nav" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            <a class="site-logo" href="html/list.html" title="GoAnimate">
			<img alt="Make a Video Online with GoAnimate.com" src="http://web.archive.org/web/20150423112540im_/http://lightspeed.goanimate.com/static/477/go/img/business_video/home/logo.png">
            </a>
        </div>

        <ul class="nav site-nav-alert-nav hidden-xs">
            <li>
                <a href="/notifications" title="Notifications"><span class="glyph-pro glyph-bell"></a>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/student">Dashboard</a></li>
                        <li><a href="/dashboard/videos">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="/account">Account Settings</a></li>
                        <li><a href="/profile/you">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="/logoff">Logout</a></li>
                    </ul>
                </li><li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/students">Students</a></li>
                        <li><a href="/teachers">Teachers</a></li>
                        <li><a href="/videos">Videos</a></li>
                        <li><a href="/public_faq">FAQ</a></li>
                    </ul>
                </li>
                <li>
				<a class="hidden-sm hidden-md hidden-lg" href="html/videomaker.html">Make a Video</a>
				<span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="html/videomaker.html">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>
		<div id="video-page">
    <input type="hidden" name="ct" value="ZGuIheohj78KogqqFMVEXQI7GASGGcS1dC1znbdZzlmaL96D6rGzqkdpEZ6YLctCdKfwSELdjFOjhwPI2Nflra0ZYdoejDwiNMviXYgFgvpZlbs5uzh6vT2Wjhfwxd_dHWNLq1QyRYEy3N99m+bD6BKqofDaJfcCemDYIm1LKlIBmZCzvyQudYFVBT7pWBPc9ZOLTvvI+ynHo1xcbKMZQatab_0Q6zyozNZ52ZrLUJ8ZWYLLe4">
    <div class="background">
        <div class="thumbnail-container" style="background-image:url('http://localhost/movie_thumbs/m-6.png')">
            <div class="thumbnail-overlay"></div>
        </div>
        <div class="container">
            <div class="main">
                <div class="video-player-viewport using-flash" style="background-image: url('http://web.archive.org/web/20181123104749im_/https://assets.vyond.com/v1/get/fs.goanimate.com/files/thumbnails/movie/2724/12296724/29109915L.jpg?enc_type=sse_c&amp;expires=1536007313&amp;sec_key_id=2034338&amp;signature=2ba191706429b6c63b86296c86862190f54a3917b195639fb28d60fed027ed7c');">
                                <div class="video-player-wrapper embed-responsive embed-responsive-16by9">
								${toObjectString(attrs, params)}
                                </div>
                                <div class="video-info hidden-xs" data-video-id="07m3MiyKSl-w" data-is-owner="yes" data-owner="0aWj-HdFtJ5c" data-duration="4" style="display: block;">
                                    <div class="video-info-content">
                                        <div class="editable">
                                            <div class="non-edit-fields">
                                                <a class="edit-video-info" data-action="edit-video-info">Edit video info</a>
                                                <h1 class="title">Test</h1>
                                                <p class="description"></p>
                                            </div>
                                        </div>
                                        <p class="creator">Created by <a href="http://web.archive.org/web/20181123104749/https://ga.vyond.com/user/0aWj-HdFtJ5c" title="WolfychuAndBeck">U</a></p>
                                        <p class="status">
                                            <span class="js-show-revision-history" style="cursor: pointer;">
                                                                                                Last modified: 17 November 2024 - 1:00am                                                                                        </span>
                                        </p>
                                    </div>
                                    <form id="movie-setting-form" class="edit-fields">
                                        <div class="form-group">
                                            <input class="form-control" type="text" name="title" placeholder="Title" value="Isabelle from animal crossing tests out poopanim8" maxlength="50">
                                        </div>
                                        <div class="form-group">
                                            <textarea class="form-control" name="desc" placeholder="Description" maxlength="255"></textarea>
                                        </div>
                                        <div class="form-group text-right">
                                            <input type="hidden" name="enc_mid" value="07m3MiyKSl-w">
                                            <button class="btn btn-orange" type="submit">Done</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="video-loading" id="video-loading" style="display: none;">
                                    <div class="video-loading-message"></div>
                                </div>
                                <div id="player-control" class="non-playing" style="display: block;">
                                    <div class="seek-bar-container">
                                        <div class="seek-bar">
                                            <div class="buffered-bar"></div>
                                            <div class="hover-bar"></div>
                                            <div class="played-bar"></div>
                                            <div class="time-tooltip"></div>
                                        </div>
                                    </div>
                                    <div class="button-container">
                                        <div class="playback-button paused">
                                            <div class="play-button"></div>
                                            <div class="pause-button"></div>
                                            <div class="replay-button"></div>
                                        </div>
                                        <div class="progress-time-container">
                                            <div class="progress-time">00:00 / 00:04</div>
                                        </div>
                                        <div class="controls-right">
                                            <div class="volume-container">
                                                <div class="volume-control">
                                                    <div class="volume-icon">
                                                        <div class="volume-up-icon"></div>
                                                        <div class="volume-mute-icon"></div>
                                                    </div>
                                                    <div class="volume-slider">
                                                        <div class="slider-track">
                                                            <div class="track-value-bar"></div>
                                                        </div>
                                                        <div class="slider-thumb"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fullscreen-container">
                                                <div class="fullscreen-button"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                <div class="sidebar col-sm-5 hidden-xs">
                    <div class="row panel-container">
                        <div class="setting-panels">
                            <div class="main-panel">
                                <div class="setting-title"><span class="glyph-pro glyph-show-thumbnails_with_lines"></span> Settings</div>
                                <ul class="setting-items">
    
    
    
    
    
    
                                    </ul>
                            </div>
                            <div class="sub-panel">
                                <div class="panel-item logo-panel">
                                    <div class="panel-title">
                                        <span class="glyph-pro glyph-chevron-left"></span><span class="text">Logo</span>
                                    </div>
                                    <div class="list-container">
                                        <div class="panel-info">
                                            Want to use a brand new logo?<br>
                                            <a href="http://web.archive.org/web/20160502045713/https://goanimate.com/account/logo">
                                                Go to Account settings &gt;
                                            </a>
                                        </div>
                                        <div class="default-logo-list-container">
                                            <ul class="logo-list">
                                                <li data-watermark="0dhteqDBt5nY"><img src="http://web.archive.org/web/20160502045713im_/http://lightspeed.goanimate.com/static/8f24b28bc4ee7cd1/go/img/watermark/no_watermark.png"></li>
                                                <li data-watermark="0vTLbQy9hG7k"><img src="http://web.archive.org/web/20160502045713im_/http://lightspeed.goanimate.com/static/8f24b28bc4ee7cd1/go/img/watermark/goanimate.png"></li>
                                            </ul>
                                        </div>
                                        <div class="logo-list-container">
                                        </div>
                                    </div>
                                </div>
                                <div class="panel-item history-panel">
                                    <div class="panel-title">
                                        <span class="glyph-pro glyph-chevron-left"></span><span class="text">Revision history</span>
                                    </div>
                                    <div class="list-container"></div>
                                </div>
                                <div class="panel-item notes-panel">
                                    <div class="panel-title">
                                        <span class="glyph-pro glyph-chevron-left"></span><span class="text">Notes</span>
                                    </div>
                                    <div class="list-container"></div>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Video player container -->
    <div class="modal" id="sample-video-modal" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-modal-content" id="sample-video-player"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" type="button" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <script charset="ISO-8859-1" src="//web.archive.org/web/20160502045713js_/http://fast.wistia.com/assets/external/E-v1.js" async=""></script>
    <script>
    $(document).on('click', '.play-btn', function(e) {
        var hashId = $(this).data('wistia');
        if (!hashId) return;
        $('#sample-video-player').html('<div class="wistia_embed wistia_async_' + hashId + ' autoPlay=true" ></div>');
        $('#sample-video-modal').modal({keyboard: true, backdrop: true}).on('hidden.bs.modal', function() {
            $('#sample-video-player').empty();
        });
        amplitudeTrackEvent(AMPLITUDE_EVENT.WATCH_DEMO_ON_VIDEO_PAGE);
    });
    </script>
    <div class="settings headline visible-xs">
        <div class="container">
            <h1 class="video-title">Final</h1>
            Created by <a href="http://web.archive.org/web/20160502045713/http://goanimate.com/user/0MR1inatR1ZA" title="teki.kolaneci">teki.kolaneci</a>        </div>
    </div>
    <div class="settings privacy private hidden-xs">
        <div class="container">
            <div class="row settings-row">
                <div class="col-sm-2">
                    <div class="settings-label hidden-xs">Share this video:</div>
                </div>
                <div class="col-sm-8">
                    <div class="using-draft"><span class="icon glyph-pro glyph-lock inline"></span>Draft</div>
                    <div class="using-private"><span class="icon glyph-pro glyph-lock inline"></span>Private</div>
                    <div class="using-public"><span class="icon glyph-pro glyph-unlock inline"></span>Public</div>
                </div>
            </div>
        </div>
        <div id="autosave-overlay" class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type="button" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 class="modal-title">Your video was autosaved</h3>
                    </div>
                    <div class="modal-body">
                        <span class="autosave-message"></span>
                        <a class="history-toggle" data-dismiss="modal">View revision history.</a>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default text-uppercase" onclick="fullscreenStudio('/videomaker/full/editcheck/0-L2CMIsF2qo');">Manually saved</button>
                        <button class="load-autosave btn btn-default btn-orange text-uppercase">Load autosaved</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    

    <div class="export disabled">
        <div class="container">
            <div class="title-row">
                <h3 class="title">Export</h3>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="download-export" data-type="Download">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Download<br><span class="text-uppercase">Video</span></div>
                        <div class="description">
                            Up to 1080p Full HD.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank"><br>View plans</a>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="gif-export" data-type="Gif">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Download<br><span class="text-uppercase">animated GIF</span></div>
                        <div class="description">
                            Paste your video clip anywhere as a GIF!                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="transfer-export">
                        <div class="icon"></div>
                        <div class="option-name">Transfer<br><span class="text-uppercase">Commercial Rights</span></div>
                        <div class="description">
                            To your clients or other third parties.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="youtube-export" data-type="Youtube" data-connected="true">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">YouTube</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="wistia-export" data-type="Wistia" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Wistia</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="vimeo-export" data-type="Vimeo" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Vimeo</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="vzaar-export" data-type="Vzaar" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Vzaar</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="viewbix-export" data-type="Viewbix" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Viewbix</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available"></div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>


                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="lectora-export" data-type="Lectora" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Lectora</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="wevideo-export" data-type="WeVideo" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">WeVideo</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="export-option" id="vidyard-export" data-type="Vidyard" data-connected="false">
                        <div class="icon"></div>
                        <button class="toggle-trigger"><span class="glyph-halfling glyph-chevron-down"></span></button>
                        <div class="option-name">Export to<br><span class="text-uppercase">Vidyard</span></div>
                        <div class="description for-unavailable">
                            Available to subscribers only.                            <a class="for-unavailable" href="http://web.archive.org/web/20160502045713/http://goanimate.com/business/videoplans" target="_blank">View plans</a>
                        </div>
                        <div class="description for-available">
                            <div class="for-connect">Connect</div>
                            <div class="for-connected">Connected</div>
                        </div>
                        <div class="toggle-content"></div>
                        <div class="spin"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="shortcut-instruction hidden-xs hidden-sm">
        <div class="container">
            <ul>
                
            </ul>
        </div>
    </div>
</div>
<div class="site-footer">
    <div class="container">
        <div class="site-footer-nav row">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>About GoAnimate</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/about">Who we are</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://resources.goanimate.com/careers/">Careers</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/contactus">Contact Us</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://blog.goanimate.com/">Blog</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://press.goanimate.com/">Press</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>GoAnimate Solutions</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/business/videoplans?hook=footer_button.site">Plans and Pricing</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/business/videoplans/federal?hook=footer_button.site">Plans for Federal Agencies</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate4schools.com/" target="_blank">GoAnimate for Schools</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>Usage Guidelines</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/termsofuse">Terms of Service</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/privacy">Privacy Policy</a></li>
                        <li><a href="//web.archive.org/web/20180307222818/https://support.goanimate.com/hc/en-us/articles/202408574" target="_blank">Cancellation Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4>Getting Help</h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://resources.goanimate.com/">Resources</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://support.goanimate.com/">Help Center</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-6">
                <div class="site-footer-socials-container">
                    Follow us on:
                    <ul class="site-footer-socials">
                        <li><a class="glyph-social glyph-facebook" href="http://web.archive.org/web/20180307222818/https://www.facebook.com/GoAnimateInc"><span class="sr-only">Facebook</span></a></li>
                        <li><a class="glyph-social glyph-twitter" href="http://web.archive.org/web/20180307222818/https://twitter.com/GoAnimate"><span class="sr-only">Twitter</span></a></li>
                        <li><a class="glyph-social glyph-linked-in" href="http://web.archive.org/web/20180307222818/https://www.linkedin.com/company/goanimate"><span class="sr-only">LinkedIn</span></a></li>
                        <li><a class="glyph-social glyph-google-plus" href="http://web.archive.org/web/20180307222818/https://plus.google.com/+goanimate"><span class="sr-only">Google+</span></a></li>
                        <li><a class="glyph-social glyph-youtube" href="http://web.archive.org/web/20180307222818/https://www.youtube.com/user/GoAnimate"><span class="sr-only">YouTube</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="site-footer-copyright">
                    <img src="http://web.archive.org/web/20180307222818im_/https://d3v4eglovri8yt.cloudfront.net/static/f789d2b2551c1fb6/go/img/footer/logo_amazon.png" alt="AWS Partner Network">
                    &nbsp;&nbsp;&nbsp;
                    <div class="ga-copy">GoAnimate © 2024</div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};

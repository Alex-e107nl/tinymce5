/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

(function() {
	tinymce.create('tinymce.plugins.e107Plugin', {
		
		init : function(ed,url) {

			var t = this;

            console.log('Initializing e107 TinyMce Plugin');

			ed.on('beforeSetContent', function(e)
			{
		        e.content = t['_e107_bbcode2html'](e.content, url);

			});

			ed.on('change', function(e) {
			//	  console.log('the event object ', e);
			//	console.log(e);
           	//	console.log('the editor object ', ed);
           //		console.log('the content ', ed.getContent());
			});


		//	ed.contentCSS.push(url+'/e107.css');


			ed.on('postProcess', function(e) {

          //      console.log(e);
          //      alert(e.content); // remove comment to test.

				if (e.set) {
					e.content = t['_e107_bbcode2html'](e.content, url);
				}

				if (e.get) {
					e.content = t['_e107_html2bbcode'](e.content, url);
				}


			});
			

		// Emoticons 
		//	ed.addButton('e107-bbcode', {
			//	ed.addMenuItem('e107-bbcode', {
					
				ed.ui.registry.addButton ('e107-bbcode', {
				text: 'e107 BBcode',
				context: 'insert',
				icon: 'emoji',
				onAction: function () {
					// Open window
										
					ed.windowManager.openUrl({
						title: 'Insert e107 BBcode',
						body: [
							{type: 'textbox', name: 'code', label: 'BbCode', text: 'widget', size: 80, tooltip: 'eg. [b]bold[/b]', autofocus: true} //,
                        //    {type: 'textbox', name: 'parm', label: 'Parameters'}
						],
						onAction: function (e) {

							s = e.data.code;
							s = s.trim(s);

							var html = $.ajax({
								type: 'POST',
								url: url +'/parser.php',
								data: { content: s, mode: 'tohtml' },
								async       : false,

								dataType: 'html',
								success: function(html) {
								  return html;
								},
								error: function (request, status, error) {
                                    console.log(request.responseText);
                                }
							}).responseText;

							html = '<x-bbcode alt=\"'+btoa(s)+'\">' + html + '</x-bbcode>   ' ;



							

							// Insert content when the window form is submitted
					//		console.log(url);
					//		console.log(html);
							ed.insertContent(html);
						}
					});
				}
			});
			

			// Media Manager Button 
			ed.ui.registry.addButton('e107-image', {
				text: '',
				title: 'Insert Media-Manager Image',
				icon: 'image',
				tooltip: 'Media-Manager Image',
				 onAction: function (buttonApi) {
					
					ed.windowManager.openUrl({
						title: 'Media Manager',
						url: url + '/mediamanager.php?image',
						width: 1050,
						height: 720,
						id: 'media-manager'
					});
				}
			});
			
					// Media Manager Button 
			ed.ui.registry.addButton('e107-video', {
				text: '',
				title: 'Insert Media-Manager Video',
				icon: 'embed',
				tooltip: 'Media-Manager Video',
				resizable : 'no',
                inline : 'yes',
                close_previous : 'no',
                
				 onAction: function (buttonApi) {
					
					ed.windowManager.openUrl({
						title: 'Media Manager',
						url: url + '/mediamanager.php?video',
						width: 1050,
						height: 720,
						id: 'media-manager'
					});
				}
			});
			
			ed.ui.registry.addButton('e107-glyph', {
				text: '',
				title: 'Insert Media-Manager Glyph',
				icon: 'insert-character',
				tooltip: 'Media-Manager Glyph',
				 onAction: function (buttonApi) {
					
					tinymce.activeEditor.windowManager.openUrl({
						title: 'Media Manager',
						url: url + '/mediamanager.php?glyph',
						width: 1050,
						height: 720,
						id: 'media-manager'

					});
				}
			});


		// TODO place animate.css options in here --------------
  		ed.ui.registry.addButton('e107-animate', { //TODO  MUST added 'e107-animate' button to templates/mainadmin.xml

            type: 'menubutton',

            text: 'todo',

           icon: 'charmap',

            menu: [

                { text: 'fadeIn',  onAction: function (buttonApi) {tinymce.activeEditor.formatter.toggle('alignleft');}}, // TODO get this working to toggle css classes.

                { text: 'fadeInDown',  onAction: function (buttonApi) {tinymce.activeEditor.formatter.toggle('aligncenter');}},

                { text: 'fadeInDownBig',  onAction: function (buttonApi) {tinymce.activeEditor.formatter.toggle('alignright');}},

                { text: 'fadeInLeft',  onAction: function (buttonApi) {tinymce.activeEditor.formatter.toggle('alignjustify');}},

            ]

        });

		// -------------------
			
		},

		getInfo: function() {
			return {
				longname: 'e107 Parser Plugin',
				author: 'Moxiecode Systems AB',
				authorurl: 'http://www.tinymce.com',
				infourl: 'http://www.tinymce.com/wiki.php/Plugin:bbcode'
			};
		},

		// Private methods

		// HTML -> BBCode in PunBB dialect
		_e107_html2bbcode : function(s, url) {
			s = tinymce.trim(s);

            if(s === '')
            {
                return '';
            }
        //    console.log('html2bbcode '+ s);

			var p = $.ajax({
					type: "POST",
					url: url + "/parser.php",
					data: { content: s, mode: 'tobbcode' },
					async: false,

					dataType: "html",
					success: function(html) {
				      return html;
				    },
				     error: function (request, status, error) {
                        console.log(request.responseText);
                    }
				}).responseText;

			return p;

			
		},

		// BBCode -> HTML from PunBB dialect
		_e107_bbcode2html : function(s, url) {
			s = tinymce.trim(s);

			if(s === '')
            {
                return '';
            }

		// FIXME mod-security might block the ajax call below with Rules: 942230, 949110, 980130 - reason yet unknown.
        //    console.log('bbcode2html '+ s);

			var p = $.ajax({
					type: "POST",
					url: url + "/parser.php",
					data: { content: s, mode: 'tohtml' },
					async: false,

					dataType: "html",
					success: function(html) {
				      return html;
				    },
				    error: function (request, status, error) {
                        console.log(request.responseText);
                    }
				}).responseText;

				return p;

			
		}
	});

	// Register plugin
	tinymce.PluginManager.add('e107', tinymce.plugins.e107Plugin);
})();
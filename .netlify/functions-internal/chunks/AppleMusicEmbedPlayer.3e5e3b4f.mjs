import { c as createVNode, F as Fragment } from '../entry.mjs';
import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'mime';
import 'sharp';
/* empty css                 */import 'nanostores';
import '@altano/tiny-async-pool';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const html = "<p>Embeddable web player widget for Apple Music that lets users log in and listen to full song playback in the browser leveraging <a href=\"https://developer.apple.com/documentation/musickitjs\">MusicKit.js</a>. Read more about this project on <a href=\"https://9to5mac.com/2018/06/03/apple-music-embeddable-web-player-listen-browser/\">9to5Mac</a>.</p>";

				const frontmatter = {"date":"2017-12-01","title":"Apple Music Embeddable Web Player Widget","github":"","external":"https://tools.applemusic.com/en-us","tech":["MusicKit.js","JS","SCSS"],"company":"Apple","showInProjects":true};
				const file = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/AppleMusicEmbedPlayer.md";
				const url = undefined;
				function rawContent() {
					return "\nEmbeddable web player widget for Apple Music that lets users log in and listen to full song playback in the browser leveraging [MusicKit.js](https://developer.apple.com/documentation/musickitjs). Read more about this project on [9to5Mac](https://9to5mac.com/2018/06/03/apple-music-embeddable-web-player-listen-browser/).\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeaders, getHeadings, rawContent, url };

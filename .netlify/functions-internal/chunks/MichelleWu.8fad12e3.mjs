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

const html = "";

				const frontmatter = {"date":"2020-09-15","title":"Michelle Wu for Boston Grassroots Toolkit","github":"","external":"https://toolkit.michelleforboston.com/","tech":["Gatsby","Styled Components"],"company":"Upstatement","showInProjects":false};
				const file = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/MichelleWu.md";
				const url = undefined;
				function rawContent() {
					return "";
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

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

const html = "<ul>\n<li>Implemented multiple frontend projects using modern frontend frameworks, i.e., Angular, Svelte, React, Vue</li>\n<li>Improved software quality by setting up foundation for Angular application e.g. migrate TSLint to ESLint, replace Karma and Jasmine with Jest and Angular Testing Library, add Mock Service Worker, and set up local quality check workflow e.g. local SonarQube, and pre-push hook.</li>\n<li>Mentored frontend developers in the organization through coaching, pair programming and code review.</li>\n<li>Lead frontend discussions both within and cross teams.</li>\n<li>Decoupled new frontend from frontend monolith by adopting Micro Frontends architecture style into the organization.</li>\n<li>Improved user experience by reducing time to interactive (TTI) by 38% - from 17.8s to 11s - as captured by lighthouse by enabling the compression algorithm in the server.</li>\n</ul>";

				const frontmatter = {"date":"2012-07-01","title":"Lead Developer - Frontend","company":"ExxonMobil","location":"Bangkok, Thailand","range":"July 2012 - October 2022","url":"https://corporate.exxonmobil.com/"};
				const file = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/jobs/ExxonMobil/index.md";
				const url = undefined;
				function rawContent() {
					return "\n\n- Implemented multiple frontend projects using modern frontend frameworks, i.e., Angular, Svelte, React, Vue\n- Improved software quality by setting up foundation for Angular application e.g. migrate TSLint to ESLint, replace Karma and Jasmine with Jest and Angular Testing Library, add Mock Service Worker, and set up local quality check workflow e.g. local SonarQube, and pre-push hook.\n- Mentored frontend developers in the organization through coaching, pair programming and code review.\n- Lead frontend discussions both within and cross teams.\n- Decoupled new frontend from frontend monolith by adopting Micro Frontends architecture style into the organization.\n- Improved user experience by reducing time to interactive (TTI) by 38% - from 17.8s to 11s - as captured by lighthouse by enabling the compression algorithm in the server.";
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

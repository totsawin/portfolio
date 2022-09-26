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

const html = "<p>A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on <a href=\"https://marketplace.visualstudio.com/items?itemName=brittanychiang.halcyon-vscode\">Visual Studio Marketplace</a>, <a href=\"https://packagecontrol.io/packages/Halcyon%20Theme\">Package Control</a>, <a href=\"https://atom.io/themes/halcyon-syntax\">Atom Package Manager</a>, and <a href=\"https://www.npmjs.com/package/hyper-halcyon-theme\">npm</a>.</p>";

				const frontmatter = {"date":"2017-12-27","title":"Halcyon Theme","github":"https://github.com/bchiang7/halcyon-site","external":"https://halcyon-theme.netlify.com/","tech":["VS Code","Sublime Text","Atom","iTerm2","Hyper"],"showInProjects":false};
				const file = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/HalcyonTheme.md";
				const url = undefined;
				function rawContent() {
					return "\nA minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=brittanychiang.halcyon-vscode), [Package Control](https://packagecontrol.io/packages/Halcyon%20Theme), [Atom Package Manager](https://atom.io/themes/halcyon-syntax), and [npm](https://www.npmjs.com/package/hyper-halcyon-theme).\n";
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

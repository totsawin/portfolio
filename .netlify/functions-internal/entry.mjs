import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape as escape$1 } from 'html-escaper';
import mime from 'mime';
import sharp$1 from 'sharp';
/* empty css                        */import { atom } from 'nanostores';
import { doWork } from '@altano/tiny-async-pool';
import { dim, bold, red, yellow, cyan, green, bgGreen, black } from 'kleur/colors';
import fs from 'node:fs/promises';
import OS from 'node:os';
import path, { basename as basename$1, extname as extname$1, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import MagicString from 'magic-string';
import { Readable } from 'node:stream';
import slash from 'slash';
import sizeOf from 'image-size';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

const $$module1$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get warnForMissingAlt () { return warnForMissingAlt; },
	get Image () { return $$Image; },
	get Picture () { return $$Picture; }
}, Symbol.toStringTag, { value: 'Module' }));

function check$1(Component) {
	return Component['render'] && Component['$$render'];
}

async function renderToStaticMarkup$1(Component, props, slotted) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		slots[key] = () =>
			`<astro-slot${key === 'default' ? '' : ` name="${key}"`}>${value}</astro-slot>`;
	}
	const { html } = Component.render(props, { $$slots: slots });
	return { html };
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.1.1";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape$1;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value) {
  return value.map((v) => convertToSerializedForm(v));
}
function serializeObject(value) {
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v)];
    })
  );
}
function convertToSerializedForm(value) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props) {
  return JSON.stringify(serializeObject(props));
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(componentUrl);
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(renderer.clientEntrypoint);
    island.props["props"] = escapeHTML(serializeProps(props));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t)},o=(t,i)=>{if(t===""||!Array.isArray(i))return i;const[e,n]=i;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const i=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const s of n){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("data-astro-template")||"default"]=s.innerHTML,s.remove())}for(const s of i){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("name")||"default"]=s.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((i,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url")),this.start()}start(){const i=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:s}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),r=this.getAttribute("component-export")||"default";if(!r.includes("."))this.Component=a[r];else{this.Component=a;for(const d of r.split("."))this.Component=this.Component[d]}return this.hydrator=s,this.hydrate},i,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary$1 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary$1 = dictionary$1.length;
function bitwise$1(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash$1(text) {
  let num;
  let result = "";
  let integer = bitwise$1(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary$1) {
    num = integer % binary$1;
    integer = Math.floor(integer / binary$1);
    result = dictionary$1[num] + result;
  }
  if (integer > 0) {
    result = dictionary$1[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash$1(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

new TextEncoder();

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
function defineStyleVars(defs) {
  let output = "";
  let arr = !Array.isArray(defs) ? [defs] : defs;
  for (const vars of arr) {
    for (const [key, value] of Object.entries(vars)) {
      if (value || value === 0) {
        output += `--${key}: ${value};`;
      }
    }
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

function isOutputFormat(value) {
  return ["avif", "jpeg", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}

class SharpService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, fit, position, background, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    return { searchParams };
  }
  parseTransform(searchParams) {
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
  async transform(inputBuffer, transform) {
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.background) {
      sharpImage.flatten({ background: transform.background });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

function isRemoteImage(src) {
  return /^http(s?):\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src, format) {
  const index = src.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return src.substring(index);
}
function removeExtname(src) {
  const index = src.lastIndexOf(".");
  if (index <= 0) {
    return src;
  }
  return src.substring(0, index);
}
function basename(src) {
  return src.replace(/^.*[\\\/]/, "");
}
function propsToFilename(transform) {
  let filename = removeQueryString(transform.src);
  filename = basename(filename);
  const ext = extname(filename);
  filename = removeExtname(filename);
  const outputExt = transform.format ? `.${transform.format}` : ext;
  return `/${filename}_${shorthash(JSON.stringify(transform))}${outputExt}`;
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function joinPaths(...paths) {
  return paths.filter(isString).map(trimSlashes).join("/");
}

async function loadRemoteImage$1(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return void 0;
  }
}
const get = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage$1(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$e = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Head.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$g = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Head.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Head = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$Head;
  const { metadescription, title, location } = Astro2.props;
  return renderTemplate`<head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"${addAttribute(metadescription, "content")}>
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
	  <link rel="canonical"${addAttribute(location, "href")}>
    <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
    <link rel="manifest" href="/favicons/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

  ${renderHead($$result)}</head>`;
});

const $$file$e = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Head.astro";
const $$url$e = undefined;

const $$module1$8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$e,
	default: $$Head,
	file: $$file$e,
	url: $$url$e
}, Symbol.toStringTag, { value: 'Module' }));

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
Promise.resolve();
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = '';
    let last = 0;
    while (pattern.test(str)) {
        const i = pattern.lastIndex - 1;
        const ch = str[i];
        escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : (ch === '"' ? '&quot;' : '&lt;'));
        last = i + 1;
    }
    return escaped + str.substring(last);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape(value, true)}"`;
    return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
    return Object.keys(style_object)
        .filter(key => style_object[key])
        .map(key => `${key}: ${style_object[key]};`)
        .join(' ');
}
function add_styles(style_object) {
    const styles = style_object_to_string(style_object);
    return styles ? ` style="${styles}"` : '';
}

const isMobileMenuOpen = atom(false);

function setMobileMenuOpen(isOpen) {
    isMobileMenuOpen.set(isOpen);
    hideOverflowContentWhenDisplayMobileMenu();
}

function hideOverflowContentWhenDisplayMobileMenu() {
    const root = document.documentElement;
    if(isMobileMenuOpen.get()){
        root.style.setProperty('--overflow-property', 'hidden');
    } else {
        root.style.setProperty('--overflow-property', 'revert');
    }
}

/* src/components/Content.svelte generated by Svelte v3.50.0 */

const css$5 = {
	code: ".blur.svelte-1tyqnyt *{filter:blur(1px) brightness(0.9);transition:var(--transition);pointer-events:none;user-select:none}",
	map: null
};

const Content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $isMobileMenuOpen, $$unsubscribe_isMobileMenuOpen;
	$$unsubscribe_isMobileMenuOpen = subscribe(isMobileMenuOpen, value => $isMobileMenuOpen = value);
	$$result.css.add(css$5);
	$$unsubscribe_isMobileMenuOpen();

	return `<div id="${"content"}" class="${["svelte-1tyqnyt", $isMobileMenuOpen ? "blur" : ""].join(' ').trim()}">${slots.default ? slots.default({}) : ``}
</div>`;
});

const $$module2$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const config = {
  email: 'totsawin.jangprasert@gmail.com',

  socialMedia: [
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/totsawin-jangprasert',
    },
    {
      name: 'Medium',
      url: 'https://totsawin-jangprasert.medium.com'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/totsawin',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/windsays'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/windisnothere/',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/totsawin',
    }
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Blog',
      url: '/#blogs',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ]
};

const $$module1$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: config
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$d = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Side.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$f = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Side.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Side = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Side;
  const { isHome, orientation } = Astro2.props;
  const delay = isHome ? "3000ms" : "0ms";
  const duration = isHome ? "300ms" : "0ms";
  let leftPosition, rightPosition;
  if (orientation === "left") {
    leftPosition = "40px";
    rightPosition = "auto";
  } else {
    leftPosition = "auto";
    rightPosition = "40px";
  }
  const $$definedVars = defineStyleVars([{ leftPosition, rightPosition, duration, delay }]);
  const STYLES = [
    { props: { "lang": "scss", "define:vars": { leftPosition, rightPosition, duration, delay }, "data-astro-id": "LIXNYEDK" }, children: `@keyframes fade{from{opacity:0}to{opacity:1}}.side-element:where(.astro-LIXNYEDK){width:40px;position:fixed;bottom:0;left:var(--leftPosition);right:var(--rightPosition);z-index:10;color:var(--light-slate)}@media (max-width: 1080px){.side-element:where(.astro-LIXNYEDK){left:calc(var(--leftPosition) / 2);right:calc(var(--rightPosition) / 2)}}@media (max-width: 768px){.side-element:where(.astro-LIXNYEDK){display:none}}@media (prefers-reduced-motion: no-preference){.side-element:where(.astro-LIXNYEDK){animation:fade var(--easing);animation-duration:var(--duration);animation-delay:var(--delay);animation-fill-mode:backwards}}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="side-element astro-LIXNYEDK"${addAttribute($$definedVars, "style")}>
    ${renderSlot($$result, $$slots["default"])}
</div>


`;
});

const $$file$d = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Side.astro";
const $$url$d = undefined;

const $$module2$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$d,
	default: $$Side,
	file: $$file$d,
	url: $$url$d
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/icons/appstore.svelte generated by Svelte v3.50.0 */

const Appstore = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg version="${"1.1"}" xmlns="${"http://www.w3.org/2000/svg"}" x="${"0px"}" y="${"0px"}" viewBox="${"0 0 512 512"}" xml:space="${"preserve"}"><title>Apple App Store</title><g><g><path d="${"M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105\n      C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302\n      c41.355,0,75,33.645,75,75V407z"}"></path></g></g><g><g><path d="${"M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166\n      l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664\n      L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498\n      C306.487,136.719,307.375,129.981,305.646,123.531z"}"></path></g></g><g><g><path d="${"M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65\n      c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341\n      H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z"}"></path></g></g><g><g><path d="${"M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344\n      c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z"}"></path></g></g></svg>`;
});

/* src/components/icons/bookmark.svelte generated by Svelte v3.50.0 */

const Bookmark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"1"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-bookmark"}"><title>Bookmark</title><path d="${"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"}"></path></svg>;`;
});

/* src/components/icons/codepen.svelte generated by Svelte v3.50.0 */

const Codepen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-codepen"}"><title>CodePen</title><polygon points="${"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"}"></polygon><line x1="${"12"}" y1="${"22"}" x2="${"12"}" y2="${"15.5"}"></line><polyline points="${"22 8.5 12 15.5 2 8.5"}"></polyline><polyline points="${"2 15.5 12 8.5 22 15.5"}"></polyline><line x1="${"12"}" y1="${"2"}" x2="${"12"}" y2="${"8.5"}"></line></svg>`;
});

/* src/components/icons/external.svelte generated by Svelte v3.50.0 */

const External = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-external-link"}"><title>External Link</title><path d="${"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}"></path><polyline points="${"15 3 21 3 21 9"}"></polyline><line x1="${"10"}" y1="${"14"}" x2="${"21"}" y2="${"3"}"></line></svg>`;
});

/* src/components/icons/facebook.svelte generated by Svelte v3.50.0 */

const Facebook = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"1"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"><path d="${"M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"}"></path></svg>`;
});

/* src/components/icons/folder.svelte generated by Svelte v3.50.0 */

const Folder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"1"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-folder"}"><title>Folder</title><path d="${"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}"></path></svg>`;
});

/* src/components/icons/fork.svelte generated by Svelte v3.50.0 */

const Fork = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-git-branch"}"><title>Git Fork</title><line x1="${"6"}" y1="${"3"}" x2="${"6"}" y2="${"15"}"></line><circle cx="${"18"}" cy="${"6"}" r="${"3"}"></circle><circle cx="${"6"}" cy="${"18"}" r="${"3"}"></circle><path d="${"M18 9a9 9 0 0 1-9 9"}"></path></svg>`;
});

/* src/components/icons/github.svelte generated by Svelte v3.50.0 */

const Github = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-github"}"><title>GitHub</title><path d="${"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"}"></path></svg>`;
});

/* src/components/icons/instagram.svelte generated by Svelte v3.50.0 */

const Instagram = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-instagram"}"><title>Instagram</title><rect x="${"2"}" y="${"2"}" width="${"20"}" height="${"20"}" rx="${"5"}" ry="${"5"}"></rect><path d="${"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}"></path><line x1="${"17.5"}" y1="${"6.5"}" x2="${"17.51"}" y2="${"6.5"}"></line></svg>`;
});

/* src/components/icons/linkedin.svelte generated by Svelte v3.50.0 */

const Linkedin = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-linkedin"}"><title>LinkedIn</title><path d="${"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}"></path><rect x="${"2"}" y="${"9"}" width="${"4"}" height="${"12"}"></rect><circle cx="${"4"}" cy="${"4"}" r="${"2"}"></circle></svg>`;
});

/* src/components/icons/loader.svelte generated by Svelte v3.50.0 */

const Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg id="${"logo"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 100 100"}"><title>Loader Logo</title><g><g id="${"T"}" transform="${"translate(11.000000, 5.000000)"}"><path d="${"M 41.30898,60.677971 V 33.823784 h 9.08334 V 30.615448 H 28.558971 v 3.208336 h 9.08334 v 26.854187 z"}" fill="${"currentcolor"}" pathLength="${"1"}"></path></g><path stroke="${"currentcolor"}" stroke-width="${"5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" d="${"M 50, 5\n                  L 11, 27\n                  L 11, 72\n                  L 50, 95\n                  L 89, 73\n                  L 89, 28 z"}" pathLength="${"1"}"></path></g></svg>`;
});

/* src/components/icons/logo.svelte generated by Svelte v3.50.0 */

const Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg id="${"logo"}" xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 84 96"}"><title>Logo</title><g transform="${"translate(-8.000000, -2.000000)"}"><g transform="${"translate(11.000000, 5.000000)"}"><path d="${"M 41.30898,60.677971 V 33.823784 h 9.08334 V 30.615448 H 28.558971 v 3.208336 h 9.08334 v 26.854187 z"}" fill="${"currentColor"}"></path><polygon id="${"Shape"}" stroke="${"currentColor"}" stroke-width="${"5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" points="${"39 0 0 22 0 67 39 90 78 68 78 23"}"></polygon></g></g></svg>`;
});

/* src/components/icons/medium.svelte generated by Svelte v3.50.0 */

const Medium = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg viewBox="${"0 0 256 146"}" version="${"1.1"}" xmlns="${"http://www.w3.org/2000/svg"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}" preserveAspectRatio="${"xMidYMid"}"><g><path d="${"M72.2009141,1.42108547e-14 C112.076502,1.42108547e-14 144.399375,32.5485469 144.399375,72.6964154 C144.399375,112.844284 112.074049,145.390378 72.2009141,145.390378 C32.327779,145.390378 0,112.844284 0,72.6964154 C0,32.5485469 32.325326,1.42108547e-14 72.2009141,1.42108547e-14 Z M187.500628,4.25836743 C207.438422,4.25836743 223.601085,34.8960455 223.601085,72.6964154 L223.603538,72.6964154 C223.603538,110.486973 207.440875,141.134463 187.503081,141.134463 C167.565287,141.134463 151.402624,110.486973 151.402624,72.6964154 C151.402624,34.9058574 167.562834,4.25836743 187.500628,4.25836743 Z M243.303393,11.3867175 C250.314,11.3867175 256,38.835526 256,72.6964154 C256,106.547493 250.316453,134.006113 243.303393,134.006113 C236.290333,134.006113 230.609239,106.554852 230.609239,72.6964154 C230.609239,38.837979 236.292786,11.3867175 243.303393,11.3867175 Z"}" fill="${"currentColor"}"></path></g></svg>`;
});

/* src/components/icons/playstore.svelte generated by Svelte v3.50.0 */

const Playstore = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" x="${"0px"}" y="${"0px"}" viewBox="${"0 0 512.001 512.001"}"><title>Google Play Store</title><path d="${"M464.252,212.09L99.624,8.07C84.247-1.873,64.754-2.691,48.574,5.967C32.183,14.74,22,31.737,22,50.329v411.342\n      c0,18.592,10.183,35.59,26.573,44.361c16.097,8.617,35.593,7.891,51.052-2.101l364.628-204.022\n      c16.121-9.02,25.747-25.435,25.747-43.908C490,237.527,480.374,221.111,464.252,212.09z M341.677,181.943l-50.339,50.339\n      L113.108,54.051L341.677,181.943z M55.544,467.323V44.676L267.621,256L55.544,467.323z M113.108,457.949l178.232-178.231\n      l50.339,50.339L113.108,457.949z M447.874,270.637l-75.779,42.401l-57.038-57.037l57.037-57.037l75.778,42.4\n      c7.746,4.335,8.583,11.68,8.583,14.637C456.455,258.958,455.62,266.302,447.874,270.637z"}"></path></svg>`;
});

/* src/components/icons/star.svelte generated by Svelte v3.50.0 */

const Star = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-star"}"><title>Star</title><polygon points="${"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"}"></polygon></svg>`;
});

/* src/components/icons/twitter.svelte generated by Svelte v3.50.0 */

const Twitter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<svg xmlns="${"http://www.w3.org/2000/svg"}" role="${"img"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-twitter"}"><title>Twitter</title><path d="${"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"}"></path></svg>`;
});

const $$module1$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	IconAppStore: Appstore,
	IconBookmark: Bookmark,
	IconCodepen: Codepen,
	IconExternal: External,
	IconFacebook: Facebook,
	IconFolder: Folder,
	IconFork: Fork,
	Icon,
	IconGitHub: Github,
	IconInstagram: Instagram,
	IconLinkedin: Linkedin,
	IconLoader: Loader,
	IconLogo: Logo,
	IconMedium: Medium,
	IconPlayStore: Playstore,
	IconStar: Star,
	IconTwitter: Twitter
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/icons/icon.svelte generated by Svelte v3.50.0 */

const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { name } = $$props;
	let Component;

	switch (name) {
		case 'AppStore':
			Component = Appstore;
			break;
		case 'Bookmark':
			Component = Bookmark;
			break;
		case 'Codepen':
			Component = Codepen;
			break;
		case 'External':
			Component = External;
			break;
		case 'Facebook':
			Component = Facebook;
			break;
		case 'Folder':
			Component = Folder;
			break;
		case 'Fork':
			Component = Fork;
			break;
		case 'GitHub':
			Component = Github;
			break;
		case 'Instagram':
			Component = Instagram;
			break;
		case 'Linkedin':
			Component = Linkedin;
			break;
		case 'Loader':
			Component = Loader;
			break;
		case 'Logo':
			Component = Logo;
		case 'Medium':
			Component = Medium;
			break;
		case 'PlayStore':
			Component = Playstore;
			break;
		case 'Star':
			Component = Star;
		case 'Twitter':
			Component = Twitter;
			break;
		default:
			Component = External;
	}
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	return `${validate_component(Component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}`;
});

const $$module2$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Icon
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$c = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Social.astro", { modules: [{ module: $$module1$7, specifier: "../config.js", assert: {} }, { module: $$module2$3, specifier: "./Side.astro", assert: {} }, { module: $$module2$2, specifier: "./icons/icon.svelte", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$e = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Social.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Social = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Social;
  const { socialMedia } = config;
  const { isHome } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Side", $$Side, { "isHome": isHome, "orientation": "left", "class": "astro-XM2ITZJU" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<ul class="astro-XM2ITZJU">
    ${socialMedia && socialMedia.map(({ url, name }, i) => renderTemplate`<li class="astro-XM2ITZJU">
            <a${addAttribute(url, "href")}${addAttribute(name, "aria-label")} target="_blank" rel="noreferrer" class="astro-XM2ITZJU">
              ${renderComponent($$result, "Icon", Icon, { "name": name, "class": "astro-XM2ITZJU" })}
            </a>
          </li>`)}
  </ul>` })}

`;
});

const $$file$c = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Social.astro";
const $$url$c = undefined;

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$c,
	default: $$Social,
	file: $$file$c,
	url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$b = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Email.astro", { modules: [{ module: $$module1$7, specifier: "../config.js", assert: {} }, { module: $$module2$3, specifier: "./Side.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$d = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Email.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Email = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Email;
  const { email } = config;
  const { isHome } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Side", $$Side, { "isHome": isHome, "orientation": "right", "class": "astro-UZAF7S3D" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="wrapper astro-UZAF7S3D">
      <a${addAttribute(`mailto:${email}`, "href")} class="astro-UZAF7S3D">${email}</a>
    </div>` })}`;
});

const $$file$b = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Email.astro";
const $$url$b = undefined;

const $$module4$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$b,
	default: $$Email,
	file: $$file$b,
	url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

const KEY_CODES = {
    ARROW_LEFT: 'ArrowLeft',
    ARROW_LEFT_IE11: 'Left',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_RIGHT_IE11: 'Right',
    ARROW_UP: 'ArrowUp',
    ARROW_UP_IE11: 'Up',
    ARROW_DOWN: 'ArrowDown',
    ARROW_DOWN_IE11: 'Down',
    ESCAPE: 'Escape',
    ESCAPE_IE11: 'Esc',
    TAB: 'Tab',
    SPACE: ' ',
    SPACE_IE11: 'Spacebar',
    ENTER: 'Enter',
  };

/* src/components/Menu.svelte generated by Svelte v3.50.0 */

const css$4 = {
	code: ".menu.svelte-xqne67.svelte-xqne67{display:none}@media(max-width: 768px){.menu.svelte-xqne67.svelte-xqne67{display:block}}.hamburger-button.svelte-xqne67.svelte-xqne67{display:none}@media(max-width: 768px){.hamburger-button.svelte-xqne67.svelte-xqne67{display:flex;justify-content:center;align-items:center;position:relative;z-index:10;margin-right:-15px;padding:15px;border:0;background-color:transparent;color:inherit;text-transform:none;transition-timing-function:linear;transition-duration:0.15s;transition-property:opacity, filter}}.hamburger-button.svelte-xqne67 .ham-box.svelte-xqne67{display:inline-block;position:relative;width:var(--hamburger-width);height:24px}.hamburger-button.svelte-xqne67 .ham-box-inner.svelte-xqne67{--bottom:`0`;position:absolute;top:50%;right:0;width:var(--hamburger-width);height:2px;border-radius:var(--border-radius);background-color:var(--green);transition-duration:0.22s;transition-property:transform;transition-delay:0s;transform:rotate(0deg);transition-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19)}.hamburger-button.svelte-xqne67 .ham-box-inner.svelte-xqne67:before,.hamburger-button.svelte-xqne67 .ham-box-inner.svelte-xqne67:after{content:\"\";display:block;position:absolute;left:auto;right:0;width:var(--hamburger-width);height:2px;border-radius:4px;background-color:var(--green);transition-timing-function:ease;transition-duration:0.15s;transition-property:transform}.hamburger-button.svelte-xqne67 .ham-box-inner.svelte-xqne67:before{width:120%;top:-10px;opacity:1;transition:var(--ham-before)}.hamburger-button.svelte-xqne67 .ham-box-inner.svelte-xqne67:after{width:80%;bottom:-10px;transform:0;transition:var(--ham-after)}.hamburger-button.svelte-xqne67 .menuOpen.svelte-xqne67{transition-delay:0.12s;transform:rotate(225deg);transition-timing-function:cubic-bezier(0.215, 0.61, 0.355, 1)}.hamburger-button.svelte-xqne67 .menuOpen.svelte-xqne67:before{width:100%;top:0;opacity:0;transition:var(--ham-before-active)}.hamburger-button.svelte-xqne67 .menuOpen.svelte-xqne67:after{width:100%;bottom:0;transform:rotate(-90deg);transition:var(--ham-after-active)}aside.svelte-xqne67.svelte-xqne67{display:none}@media(max-width: 768px){aside.svelte-xqne67.svelte-xqne67{display:flex;justify-content:center;align-items:center;position:fixed;top:0;bottom:0;right:0;padding:50px 10px;width:min(75vw, 400px);height:100vh;outline:0;background-color:var(--light-navy);box-shadow:-10px 0px 30px -15px var(--navy-shadow);z-index:9;transform:translateX(100vw);visibility:hidden;transition:var(--transition)}aside.menuOpen.svelte-xqne67.svelte-xqne67{transform:translateX(0vw);visibility:visible}}aside.svelte-xqne67 nav.svelte-xqne67{display:flex;justify-content:space-between;align-items:center;width:100%;flex-direction:column;color:var(--lightest-slate);font-family:var(--font-mono);text-align:center}aside.svelte-xqne67 ol.svelte-xqne67{padding:0;margin:0;list-style:none;width:100%}aside.svelte-xqne67 ol li.svelte-xqne67{position:relative;margin:0 auto 20px;counter-increment:item 1;font-size:clamp(var(--fz-sm), 4vw, var(--fz-lg))}@media(max-width: 600px){aside.svelte-xqne67 ol li.svelte-xqne67{margin:0 auto 10px}}aside.svelte-xqne67 ol li.svelte-xqne67:before{content:\"0\" counter(item) \".\";display:block;margin-bottom:5px;color:var(--green);font-size:var(--fz-sm)}aside.svelte-xqne67 ol a.svelte-xqne67{display:inline-block;text-decoration:none;text-decoration-skip-ink:auto;color:inherit;position:relative;transition:var(--transition);width:100%;padding:3px 20px 20px}aside.svelte-xqne67 ol a.svelte-xqne67:hover,aside.svelte-xqne67 ol a.svelte-xqne67:active,aside.svelte-xqne67 ol a.svelte-xqne67:focus{color:var(--green);outline:0}aside.svelte-xqne67 .resume-link.svelte-xqne67{color:var(--green);background-color:transparent;border:1px solid var(--green);border-radius:var(--border-radius);padding:1.25rem 1.75rem;font-size:var(--fz-sm);font-family:var(--font-mono);line-height:1;text-decoration:none;cursor:pointer;transition:var(--transition);padding:18px 50px;margin:10% auto 0;width:max-content}aside.svelte-xqne67 .resume-link.svelte-xqne67:hover,aside.svelte-xqne67 .resume-link.svelte-xqne67:focus,aside.svelte-xqne67 .resume-link.svelte-xqne67:active{background-color:var(--green-tint);outline:none}aside.svelte-xqne67 .resume-link.svelte-xqne67:after{display:none !important}",
	map: null
};

const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $isMobileMenuOpen, $$unsubscribe_isMobileMenuOpen;
	$$unsubscribe_isMobileMenuOpen = subscribe(isMobileMenuOpen, value => $isMobileMenuOpen = value);
	const { navLinks } = config;
	const isRenderingOnServer = typeof document === "undefined" && typeof window === "undefined";
	let firstFocusableEl;
	let lastFocusableEl;

	function onKeyDown(e) {
		switch (e.key) {
			case KEY_CODES.ESCAPE:
			case KEY_CODES.ESCAPE_IE11:
				{
					setMobileMenuOpen(false);
					break;
				}
			case KEY_CODES.TAB:
				{

					if (e.shiftKey) {
						handleBackwardTab(e);
					} else {
						handleForwardTab(e);
					}

					break;
				}
		}
	}

	function handleBackwardTab(e) {
		if (document.activeElement === firstFocusableEl) {
			e.preventDefault();
			lastFocusableEl.focus();
		}
	}

	function handleForwardTab(e) {
		if (document.activeElement === lastFocusableEl) {
			e.preventDefault();
			firstFocusableEl.focus();
		}
	}

	function onResize(e) {
		if (e.currentTarget.innerWidth > 768) {
			setMobileMenuOpen(false);
		}
	}

	onDestroy(() => {
		if (isRenderingOnServer) {
			return;
		}

		document.removeEventListener("keydown", onKeyDown);
		window.removeEventListener('resize', onResize);
	});

	$$result.css.add(css$4);
	$$unsubscribe_isMobileMenuOpen();

	return `<div class="${"menu svelte-xqne67"}"><div><button class="${"hamburger-button svelte-xqne67"}" aria-label="${"Menu"}"><div class="${"ham-box svelte-xqne67"}"><div class="${["ham-box-inner svelte-xqne67", $isMobileMenuOpen ? "menuOpen" : ""].join(' ').trim()}"></div></div></button>

    <aside${add_attribute("aria-hidden", !$isMobileMenuOpen, 0)}${add_attribute("tabindex", $isMobileMenuOpen ? 1 : -1, 0)} class="${["svelte-xqne67", $isMobileMenuOpen ? "menuOpen" : ""].join(' ').trim()}"><nav class="${"svelte-xqne67"}"><ol class="${"svelte-xqne67"}">${each(navLinks, ({ url, name }) => {
		return `<li class="${"svelte-xqne67"}"><a${add_attribute("href", url, 0)} class="${"svelte-xqne67"}">${escape(name)}</a>
            </li>`;
	})}</ol>
        <a href="${"/resume.pdf"}" class="${"resume-link svelte-xqne67"}">Resume </a></nav></aside></div>
</div>`;
});

/* src/components/Nav.svelte generated by Svelte v3.50.0 */

const css$3 = {
	code: "@keyframes svelte-1av4xnd-fade{from{opacity:0}to{opacity:1}}@keyframes svelte-1av4xnd-fade-down{from{opacity:0.01;transform:translateY(-20px)}to{opacity:1;transform:translateY(0px)}}header.svelte-1av4xnd.svelte-1av4xnd{--delay-items:0;display:flex;justify-content:space-between;align-items:center;position:fixed;top:0;z-index:11;padding:0px 50px;width:100%;height:var(--nav-height);background-color:rgba(10, 25, 47, 0.85);filter:none !important;pointer-events:auto !important;user-select:auto !important;backdrop-filter:blur(10px);transition:var(--transition)}header.transparent.svelte-1av4xnd.svelte-1av4xnd{background-color:transparent}@media(max-width: 1080px){header.svelte-1av4xnd.svelte-1av4xnd{padding:0 40px}}@media(max-width: 768px){header.svelte-1av4xnd.svelte-1av4xnd{padding:0 25px}}@media(prefers-reduced-motion: no-preference){}nav.svelte-1av4xnd.svelte-1av4xnd{display:flex;justify-content:space-between;align-items:center;position:relative;width:100%;color:var(--lightest-slate);font-family:var(--font-mono);counter-reset:item 0;z-index:12}nav.svelte-1av4xnd .logo.svelte-1av4xnd{display:flex;justify-content:center;align-items:center}nav.svelte-1av4xnd .logo a.svelte-1av4xnd{color:var(--green);width:42px;height:42px}nav.svelte-1av4xnd .logo a.svelte-1av4xnd:hover svg,nav.svelte-1av4xnd .logo a.svelte-1av4xnd:focus svg{fill:var(--green-tint)}nav.svelte-1av4xnd .logo a.svelte-1av4xnd svg{fill:none;transition:var(--transition);user-select:none}@media(prefers-reduced-motion: no-preference){nav.svelte-1av4xnd .logo.svelte-1av4xnd{animation:svelte-1av4xnd-fade var(--easing);animation-duration:var(--duration);animation-delay:var(--delay);animation-fill-mode:backwards}}.links.svelte-1av4xnd.svelte-1av4xnd{display:flex;align-items:center}@media(max-width: 768px){.links.svelte-1av4xnd.svelte-1av4xnd{display:none}}.links.svelte-1av4xnd ol.svelte-1av4xnd{display:flex;justify-content:space-between;align-items:center;padding:0;margin:0;list-style:none}.links.svelte-1av4xnd ol li.svelte-1av4xnd{margin:0 5px;position:relative;counter-increment:item 1;font-size:var(--fz-xs)}.links.svelte-1av4xnd ol li a.svelte-1av4xnd{padding:10px}.links.svelte-1av4xnd ol li a.svelte-1av4xnd:before{content:\"0\" counter(item) \".\";margin-right:5px;color:var(--green);font-size:var(--fz-xxs);text-align:right}@media(prefers-reduced-motion: no-preference){.links.svelte-1av4xnd ol li.svelte-1av4xnd{animation:svelte-1av4xnd-fade-down var(--easing);animation-duration:var(--duration);animation-delay:calc(var(--delay) + var(--delay-items) * 100ms);animation-fill-mode:backwards}}@media(prefers-reduced-motion: no-preference){.links.svelte-1av4xnd .resume-button-section.svelte-1av4xnd{animation:svelte-1av4xnd-fade-down var(--easing);animation-duration:var(--duration);animation-delay:calc(var(--delay) + var(--delay-items) * 100ms);animation-fill-mode:backwards}}.links.svelte-1av4xnd .resume-button.svelte-1av4xnd{color:var(--green);background-color:transparent;border:1px solid var(--green);border-radius:var(--border-radius);padding:0.75rem 1rem;font-size:var(--fz-xs);font-family:var(--font-mono);line-height:1;text-decoration:none;cursor:pointer;transition:var(--transition);margin-left:15px;font-size:var(--fz-xs)}.links.svelte-1av4xnd .resume-button.svelte-1av4xnd:hover,.links.svelte-1av4xnd .resume-button.svelte-1av4xnd:focus,.links.svelte-1av4xnd .resume-button.svelte-1av4xnd:active{background-color:var(--green-tint);outline:none}.links.svelte-1av4xnd .resume-button.svelte-1av4xnd:after{display:none !important}",
	map: null
};

function isScrolledToTop(scrollY) {
	return scrollY < 50;
}

const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $isMobileMenuOpen, $$unsubscribe_isMobileMenuOpen;
	$$unsubscribe_isMobileMenuOpen = subscribe(isMobileMenuOpen, value => $isMobileMenuOpen = value);
	const { navLinks } = config;
	let { isHome } = $$props;
	const delay = isHome ? '3000ms' : '0ms';
	const duration = isHome ? '300ms' : '0ms';
	const isRenderingOnServer = typeof window === 'undefined';
	let lastScrollY = isRenderingOnServer ? 0 : window.pageYOffset;
	let scrollDirection = 'down';
	let scrolledToTop = true;

	onDestroy(() => {
		if (isRenderingOnServer) {
			return;
		}

		window.removeEventListener('scroll', handleScroll);
	});

	function handleScroll() {
		const scrollY = window.pageYOffset;
		scrolledToTop = isScrolledToTop(scrollY);
		scrollDirection = getScrollDirection(scrollY);
		lastScrollY = scrollY > 0 ? scrollY : 0;
	}

	function getScrollDirection(scrollY) {
		const SCROLL_UP = 'up';
		const SCROLL_DOWN = 'down';
		return scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP;
	}

	if ($$props.isHome === void 0 && $$bindings.isHome && isHome !== void 0) $$bindings.isHome(isHome);
	$$result.css.add(css$3);
	$$unsubscribe_isMobileMenuOpen();

	return `<header class="${[
		escape(
			null_to_empty(scrolledToTop
			? ''
			: scrollDirection === 'up' ? 'scroll-up' : 'scroll-down'),
			true
		) + " svelte-1av4xnd",
		$isMobileMenuOpen ? "transparent" : ""
	].join(' ').trim()}" style="${"--delay: " + escape(delay, true) + "; --duration: " + escape(duration, true) + ";"}"><nav class="${"svelte-1av4xnd"}"><div class="${"logo svelte-1av4xnd"}" tabindex="${"-1"}"><a href="${"/"}" aria-label="${"home"}" class="${"svelte-1av4xnd"}">${validate_component(Logo, "IconLogo").$$render($$result, {}, {}, {})}</a></div>
        <div class="${"links svelte-1av4xnd"}"><ol class="${"svelte-1av4xnd"}">${each(navLinks, ({ url, name }, index) => {
		return `<li class="${"svelte-1av4xnd"}"${add_styles({ "--delay-items": index })}><a${add_attribute("href", url, 0)} class="${"svelte-1av4xnd"}">${escape(name)}</a>
                    </li>`;
	})}</ol>
            <div class="${"resume-button-section svelte-1av4xnd"}"${add_styles({ "--delay-items": navLinks.length })}><a class="${"resume-button svelte-1av4xnd"}" href="${"/resume.pdf"}" target="${"_blank"}" rel="${"noopener noreferrer"}">Resume
                </a></div></div>

        ${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}</nav>
</header>`;
});

const $$module5$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Nav
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$a = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Footer.astro", { modules: [{ module: $$module1$7, specifier: "../config.js", assert: {} }, { module: $$module2$2, specifier: "./icons/icon.svelte", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$c = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Footer.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Footer;
  const { socialMedia } = config;
  const response = await fetch("https://api.github.com/repos/bchiang7/v4");
  const data = await response.json();
  const { stargazers_count, forks_count } = data;
  const githubInfo = {
    stars: stargazers_count,
    forks: forks_count
  };
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<footer class="astro-7KPKI4Z7">
    <div class="social-links astro-7KPKI4Z7">
        <ul class="astro-7KPKI4Z7">
            ${socialMedia && socialMedia.map(({ name, url }) => renderTemplate`<li class="astro-7KPKI4Z7">
                            <a${addAttribute(url, "href")}${addAttribute(name, "aria-label")} class="astro-7KPKI4Z7">
                                <span class="icon astro-7KPKI4Z7">${renderComponent($$result, "Icon", Icon, { "name": name, "class": "astro-7KPKI4Z7" })}</span>
                            </a>
                        </li>`)}
        </ul>
    </div>

    <div class="credit astro-7KPKI4Z7" tabindex="-1">
        <a href="https://github.com/bchiang7/v4" class="astro-7KPKI4Z7">
            <div class="astro-7KPKI4Z7">Designed &amp; Built by Brittany Chiang</div>

            ${githubInfo.stars && githubInfo.forks && renderTemplate`<div class="github-stats astro-7KPKI4Z7">
                        <span class="astro-7KPKI4Z7">
                            <span class="icon astro-7KPKI4Z7">${renderComponent($$result, "Icon", Icon, { "name": "Star", "class": "astro-7KPKI4Z7" })}</span>
                            <span class="astro-7KPKI4Z7">${githubInfo.stars.toLocaleString()}</span>
                        </span>
                        <span class="astro-7KPKI4Z7">
                            <span class="icon astro-7KPKI4Z7">${renderComponent($$result, "Icon", Icon, { "name": "Fork", "class": "astro-7KPKI4Z7" })}</span>
                            <span class="astro-7KPKI4Z7">${githubInfo.forks.toLocaleString()}</span>
                        </span>
                    </div>`}
        </a>

        <a href="https://github.com/totsawin/portfolio" class="astro-7KPKI4Z7">
            <div class="astro-7KPKI4Z7">Reimplemented in Astro by Totsawin Jangprasert</div>
        </a>
    </div>
</footer>

`;
});

const $$file$a = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Footer.astro";
const $$url$a = undefined;

const $$module6$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$Footer,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Loader.astro", { modules: [{ module: $$module1$6, specifier: "./icons/index.js", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Loader.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Loader = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Loader;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="loader astro-YONVKEYS">
  <div class="logo-wrapper astro-YONVKEYS">
    ${renderComponent($$result, "IconLoader", Loader, { "class": "astro-YONVKEYS" })}
  </div>
</div>

`;
});

const $$file$9 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Loader.astro";
const $$url$9 = undefined;

const $$module7$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Loader,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/layouts/Layout.astro", { modules: [{ module: $$module1$8, specifier: "../components/Head.astro", assert: {} }, { module: $$module2$4, specifier: "../components/Content.svelte", assert: {} }, { module: $$module3$1, specifier: "../components/Social.astro", assert: {} }, { module: $$module4$1, specifier: "../components/Email.astro", assert: {} }, { module: $$module5$1, specifier: "../components/Nav.svelte", assert: {} }, { module: $$module6$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module7$1, specifier: "../components/Loader.astro", assert: {} }], hydratedComponents: [Content, Nav], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["load"]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/layouts/Layout.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Layout;
  const seoProps = Astro2.props;
  const isHome = Astro2.url.pathname === "/";
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-5FDVBFWK">
  ${renderComponent($$result, "Head", $$Head, { ...seoProps, "class": "astro-5FDVBFWK" })}
  ${maybeRenderHead($$result)}<body class="astro-5FDVBFWK">
    ${renderComponent($$result, "Loader", $$Loader, { "class": "astro-5FDVBFWK" })}
    <div class="wrapper astro-5FDVBFWK">

      ${renderComponent($$result, "Nav", Nav, { "isHome": isHome, "client:load": true, "client:component-hydration": "load", "client:component-path": "/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Nav.svelte", "client:component-export": "default", "class": "astro-5FDVBFWK" })}
      ${renderComponent($$result, "Social", $$Social, { "isHome": isHome, "class": "astro-5FDVBFWK" })}
      ${renderComponent($$result, "Email", $$Email, { "isHome": isHome, "class": "astro-5FDVBFWK" })}

      ${renderComponent($$result, "Content", Content, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Content.svelte", "client:component-export": "default", "class": "astro-5FDVBFWK" }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "Footer", $$Footer, { "class": "astro-5FDVBFWK" })}` })}
    </div>
  </body></html>`;
});

const $$file$8 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/layouts/Layout.astro";
const $$url$8 = undefined;

const $$module1$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Layout,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Hero.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Hero.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Hero;
  const one = `<h1>Hi, my name is</h1>`;
  const two = `<h2 class="big-heading">Totsawin Jangprasert</h2>`;
  const three = `<h3 class="big-heading">Code, Mentor, Promote best practices.</h3>`;
  const four = `<p>
        I\u2019m previously a lead developer at 
        <a href="https://corporate.exxonmobil.com/" target="_blank" rel="noreferrer">ExxonMobil</a>.
        Currently, I am relocating to Japan and work as a Frontend Engineer at a fintech company name
        <a href="https://paypay.ne.jp/" target="_blank" rel="noreferrer">
          PayPay
        </a>.
      </p>`;
  const five = `<a
      class="email-link"
      href="https://totsawin-jangprasert.medium.com"
      target="_blank"
      rel="noreferrer">
      Check out my blogs!
    </a>`;
  const items = [one, two, three, four, five];
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<section id="hero" class="astro-EMNXQKOQ">
  ${items && items.map((item, i) => renderTemplate`<div${addAttribute({ "--transition-delay": `${i + 1}00ms` }, "style")} class="astro-EMNXQKOQ">${markHTMLString(item)}</div>`)}
</section> 

`;
});

const $$file$7 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Hero.astro";
const $$url$7 = undefined;

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$Hero,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

async function loadLocalImage(src) {
  try {
    return await fs.readFile(src);
  } catch {
    return void 0;
  }
}
async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return void 0;
  }
}

const PREFIX = "@astrojs/image";
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function getPrefix(level, timestamp) {
  let prefix = "";
  if (timestamp) {
    prefix += dim(dateTimeFormat.format(new Date()) + " ");
  }
  switch (level) {
    case "debug":
      prefix += bold(green(`[${PREFIX}] `));
      break;
    case "info":
      prefix += bold(cyan(`[${PREFIX}] `));
      break;
    case "warn":
      prefix += bold(yellow(`[${PREFIX}] `));
      break;
    case "error":
      prefix += bold(red(`[${PREFIX}] `));
      break;
  }
  return prefix;
}
const log = (_level, dest) => ({ message, level, prefix = true, timestamp = true }) => {
  if (levels[_level] >= levels[level]) {
    dest(`${prefix ? getPrefix(level, timestamp) : ""}${message}`);
  }
};
const info = log("info", console.info);
const debug = log("debug", console.debug);
const warn = log("warn", console.warn);

function getTimeStat(timeStart, timeEnd) {
  const buildTime = timeEnd - timeStart;
  return buildTime < 750 ? `${Math.round(buildTime)}ms` : `${(buildTime / 1e3).toFixed(2)}s`;
}
async function ssgBuild({ loader, staticImages, config, outDir, logLevel }) {
  const timer = performance.now();
  const cpuCount = OS.cpus().length;
  info({
    level: logLevel,
    prefix: false,
    message: `${bgGreen(
      black(
        ` optimizing ${staticImages.size} image${staticImages.size > 1 ? "s" : ""} in batches of ${cpuCount} `
      )
    )}`
  });
  const inputFiles = /* @__PURE__ */ new Set();
  async function processStaticImage([src, transformsMap]) {
    let inputFile = void 0;
    let inputBuffer = void 0;
    if (config.base && src.startsWith(config.base)) {
      src = src.substring(config.base.length - 1);
    }
    if (isRemoteImage(src)) {
      inputBuffer = await loadRemoteImage(src);
    } else {
      const inputFileURL = new URL(`.${src}`, outDir);
      inputFile = fileURLToPath(inputFileURL);
      inputBuffer = await loadLocalImage(inputFile);
      inputFiles.add(inputFile);
    }
    if (!inputBuffer) {
      warn({ level: logLevel, message: `"${src}" image could not be fetched` });
      return;
    }
    const transforms = Array.from(transformsMap.entries());
    debug({ level: logLevel, prefix: false, message: `${green("\u25B6")} transforming ${src}` });
    let timeStart = performance.now();
    for (const [filename, transform] of transforms) {
      timeStart = performance.now();
      let outputFile;
      if (isRemoteImage(src)) {
        const outputFileURL = new URL(path.join("./assets", path.basename(filename)), outDir);
        outputFile = fileURLToPath(outputFileURL);
      } else {
        const outputFileURL = new URL(path.join("./assets", filename), outDir);
        outputFile = fileURLToPath(outputFileURL);
      }
      const { data } = await loader.transform(inputBuffer, transform);
      await fs.writeFile(outputFile, data);
      const timeEnd = performance.now();
      const timeChange = getTimeStat(timeStart, timeEnd);
      const timeIncrease = `(+${timeChange})`;
      const pathRelative = outputFile.replace(fileURLToPath(outDir), "");
      debug({
        level: logLevel,
        prefix: false,
        message: `  ${cyan("created")} ${dim(pathRelative)} ${dim(timeIncrease)}`
      });
    }
  }
  await doWork(cpuCount, staticImages, processStaticImage);
  info({
    level: logLevel,
    prefix: false,
    message: dim(`Completed in ${getTimeStat(timer, performance.now())}.
`)
  });
}

async function metadata(src) {
  const file = await fs.readFile(src);
  const { width, height, type, orientation } = await sizeOf(file);
  const isPortrait = (orientation || 0) >= 5;
  if (!width || !height || !type) {
    return void 0;
  }
  return {
    src: fileURLToPath(src),
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type
  };
}

function createPlugin(config, options) {
  const filter = (id) => /^(?!\/_image?).*.(heic|heif|avif|jpeg|jpg|png|tiff|webp|gif)$/.test(id);
  const virtualModuleId = "virtual:image-loader";
  let resolvedConfig;
  return {
    name: "@astrojs/image",
    enforce: "pre",
    configResolved(viteConfig) {
      resolvedConfig = viteConfig;
    },
    async resolveId(id) {
      if (id === virtualModuleId) {
        return await this.resolve(options.serviceEntryPoint);
      }
    },
    async load(id) {
      if (!filter(id)) {
        return null;
      }
      const url = pathToFileURL(id);
      const meta = await metadata(url);
      if (!meta) {
        return;
      }
      if (!this.meta.watchMode) {
        const pathname = decodeURI(url.pathname);
        const filename = basename$1(pathname, extname$1(pathname) + `.${meta.format}`);
        const handle = this.emitFile({
          name: filename,
          source: await fs.readFile(url),
          type: "asset"
        });
        meta.src = `__ASTRO_IMAGE_ASSET__${handle}__`;
      } else {
        const relId = path.relative(fileURLToPath(config.srcDir), id);
        meta.src = join("/@astroimage", relId);
        meta.src = slash(meta.src);
      }
      return `export default ${JSON.stringify(meta)}`;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        var _a;
        if ((_a = req.url) == null ? void 0 : _a.startsWith("/@astroimage/")) {
          const [, id] = req.url.split("/@astroimage/");
          const url = new URL(id, config.srcDir);
          const file = await fs.readFile(url);
          const meta = await metadata(url);
          if (!meta) {
            return next();
          }
          const transform = await sharp_default.parseTransform(url.searchParams);
          if (!transform) {
            return next();
          }
          const result = await sharp_default.transform(file, transform);
          res.setHeader("Content-Type", `image/${result.format}`);
          res.setHeader("Cache-Control", "max-age=360000");
          const stream = Readable.from(result.data);
          return stream.pipe(res);
        }
        return next();
      });
    },
    async renderChunk(code) {
      const assetUrlRE = /__ASTRO_IMAGE_ASSET__([a-z\d]{8})__(?:_(.*?)__)?/g;
      let match;
      let s;
      while (match = assetUrlRE.exec(code)) {
        s = s || (s = new MagicString(code));
        const [full, hash, postfix = ""] = match;
        const file = this.getFileName(hash);
        const outputFilepath = resolvedConfig.base + file + postfix;
        s.overwrite(match.index, match.index + full.length, outputFilepath);
      }
      if (s) {
        return {
          code: s.toString(),
          map: resolvedConfig.build.sourcemap ? s.generateMap({ hires: true }) : null
        };
      } else {
        return null;
      }
    }
  };
}

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? sharp_default : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : sharp_default.serializeTransform(resolved);
  let src;
  if (/^[\/\\]?@astroimage/.test(resolved.src)) {
    src = `${resolved.src}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", resolved.src);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname$1(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname$1(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          format,
          width,
          fit,
          position,
          background,
          height: Math.round(width / aspectRatio)
        });
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const allFormats = await resolveFormats(params);
  const image = await getImage({
    src,
    width: Math.max(...widths),
    aspectRatio,
    fit,
    position,
    background,
    format: allFormats[allFormats.length - 1]
  });
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const PKG_NAME = "@astrojs/image";
const ROUTE_PATTERN = "/_image";
function integration(options = {}) {
  const resolvedOptions = {
    serviceEntryPoint: "@astrojs/image/sharp",
    logLevel: "info",
    ...options
  };
  let _config;
  const staticImages = /* @__PURE__ */ new Map();
  function getViteConfiguration() {
    return {
      plugins: [createPlugin(_config, resolvedOptions)],
      optimizeDeps: {
        include: ["image-size", "sharp"]
      },
      ssr: {
        noExternal: ["@astrojs/image", resolvedOptions.serviceEntryPoint]
      }
    };
  }
  return {
    name: PKG_NAME,
    hooks: {
      "astro:config:setup": ({ command, config, updateConfig, injectRoute }) => {
        _config = config;
        updateConfig({ vite: getViteConfiguration() });
        if (command === "dev" || config.output === "server") {
          injectRoute({
            pattern: ROUTE_PATTERN,
            entryPoint: "@astrojs/image/endpoint"
          });
        }
      },
      "astro:build:setup": () => {
        function addStaticImage(transform) {
          const srcTranforms = staticImages.has(transform.src) ? staticImages.get(transform.src) : /* @__PURE__ */ new Map();
          const filename = propsToFilename(transform);
          srcTranforms.set(filename, transform);
          staticImages.set(transform.src, srcTranforms);
          return prependForwardSlash(joinPaths(_config.base, "assets", filename));
        }
        globalThis.astroImage = _config.output === "static" ? {
          addStaticImage
        } : {};
      },
      "astro:build:done": async ({ dir }) => {
        var _a;
        if (_config.output === "static") {
          const loader = (_a = globalThis == null ? void 0 : globalThis.astroImage) == null ? void 0 : _a.loader;
          if (loader && "transform" in loader && staticImages.size > 0) {
            await ssgBuild({
              loader,
              staticImages,
              config: _config,
              outDir: dir,
              logLevel: resolvedOptions.logLevel
            });
          }
        }
      }
    }
  };
}

const $$module1$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: integration,
	getImage,
	getPicture
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/node_modules/@astrojs/image/components/Image.astro", { modules: [{ module: $$module1$4, specifier: "../dist/index.js", assert: {} }, { module: $$module1$3, specifier: "./index.js", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/node_modules/@astrojs/image/components/Image.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs, "attrs", { "class": "astro-Y6AP2UOZ" })}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>

`;
});

createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/node_modules/@astrojs/image/components/Picture.astro", { modules: [{ module: $$module1$4, specifier: "../dist/index.js", assert: {} }, { module: $$module1$3, specifier: "./index.js", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/node_modules/@astrojs/image/components/Picture.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position
  });
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(attrs, "attrs", { "class": "astro-FVMJBM2G" })}>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2, "attrs", { "class": "astro-FVMJBM2G" })}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image, "image", { "class": "astro-FVMJBM2G" })}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${addAttribute(alt, "alt")}>
</picture>

`;
});

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const me = {"src":"/assets/me.ce158c08.jpg","width":320,"height":318,"format":"jpg"};

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: me
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/About.astro", { modules: [{ module: $$module1$3, specifier: "@astrojs/image/components", assert: {} }, { module: $$module2, specifier: "../assets/images/me.jpg", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/About.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$About;
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "AngularJS",
    "Angular",
    "Svelte",
    "React",
    "Vue",
    "Astro",
    "SvelteKit",
    "Remix",
    "Hydrogen",
    "Strapi",
    "Nx"
  ];
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<section id="about" class="scroll-reveal astro-UNJSXKVO">
  <h2 class="numbered-heading astro-UNJSXKVO">About Me</h2>

  <div class="inner astro-UNJSXKVO">
    <div class="content astro-UNJSXKVO">
      <div class="astro-UNJSXKVO">
        <p class="astro-UNJSXKVO">
          I love to see my works become tangible products being used and loved by people. 
          This is what I reflect to my obsession with the frontend development. 
          It is the combination of aesthetics and logics. 
        </p>

        <p class="astro-UNJSXKVO">
          I worked for ${" "}<a href="https://corporate.exxonmobil.com/" class="astro-UNJSXKVO">ExxonMobil</a> for 10 years.
          My career started around the beginning of 2010’s where it was also the historical time of 
          the frontend development as its landscape was shifted since the birth of the very first SPA 
          framework, AngularJS. At that time, I was assigned to work on ${" "}
          <a href="https://cs-selfserve.exxonmobil.com" class="astro-UNJSXKVO">Ecommerce website</a>. This experience taught 
          me valuable lessons - code quality and XP practices can help the team maintain the velocity 
          and save team from paying the debts in the future. It was this time that I was firstly recognized 
          as the frontend developer expert when I solved many Production and hard issues. 
        </p>

        <p class="astro-UNJSXKVO">
          In 2018, there were multiple projects initiated to capture the new business opportunities. 
          This time I was in both the development teams and the governance team to help shaping the teams 
          to make the consistent judgement and implementation. Angular is the framework of choice because of 
          its opinionated and our expertise. I started as the senior frontend developer in the team. As the 
          experience from the previous project, this time we found the balance between delivering business 
          values and maintaining the highest possible code quality. 
        </p>

        <p class="astro-UNJSXKVO">
          In 2020, I was assigned to be the team lead of legacy application. I put effort on Increasing software 
          quality through refactoring and automated tests. Also, I initiated the effort to implement Micro Frontends 
          architectural style in order to decouple new frontend from frontend monolith and expect it would be the 
          foundation of decoupling and rewriting the fronted monoliths into smaller and manageable chunks within its 
          own domain. 
        </p>

        <p class="astro-UNJSXKVO">
          In 2021, I was appointed to be the Lead Developer, the highest individual contributor role. In this role, 
          I developed code, mentored people, promoted code quality and technical best practices within and outside 
          the organization, and helped architects evaluating options. I spend free time with side projects to explore
          new web framework capabilities.
        </p>

        <p class="astro-UNJSXKVO">
          Now I am relocating to Japan and work as a Frontend Engineer at a fintech company name
          ${" "}<a href="https://paypay.ne.jp/" class="astro-UNJSXKVO">PayPay</a>.
        </p>

        <p class="astro-UNJSXKVO">Here are a few technologies I’ve been working with recently:</p>
      </div>

      <ul class="skills-list astro-UNJSXKVO">
        ${skills && skills.map((skill) => renderTemplate`<li class="astro-UNJSXKVO">${skill}</li>`)}
      </ul>
    </div>

    <!-- <div class="picture">
      <div class="wrapper">
        <Picture src={me} widths={[80, 160, 320]} aspectRatio="1:1" sizes="(max-width: 1080px) 70vw, 320px" alt="my photo" />
      </div>
    </div> -->
  </div>
</section>

`;
});

const $$file$6 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/About.astro";
const $$url$6 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$About,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/Jobs.svelte generated by Svelte v3.50.0 */

const css$2 = {
	code: "@charset \"UTF-8\";section.svelte-1fydtat.svelte-1fydtat{max-width:700px}section.svelte-1fydtat .inner.svelte-1fydtat{display:flex}@media(max-width: 600px){section.svelte-1fydtat .inner.svelte-1fydtat{display:block}}@media(min-width: 700px){section.svelte-1fydtat .inner.svelte-1fydtat{min-height:340px}}.tablist.svelte-1fydtat.svelte-1fydtat{position:relative;z-index:3;width:max-content;padding:0;margin:0;list-style:none}@media(max-width: 600px){.tablist.svelte-1fydtat.svelte-1fydtat{display:flex;overflow-x:auto;width:calc(100% + 100px);padding-left:50px;margin-left:-50px;margin-bottom:30px}}@media(max-width: 480px){.tablist.svelte-1fydtat.svelte-1fydtat{width:calc(100% + 50px);padding-left:25px;margin-left:-25px}}@media(max-width: 600px){}@media(max-width: 480px){}@media(max-width: 600px){}@media(max-width: 480px){}.tab-button.svelte-1fydtat.svelte-1fydtat{display:inline-block;text-decoration:none;text-decoration-skip-ink:auto;color:inherit;position:relative;transition:var(--transition);display:flex;align-items:center;width:100%;height:var(--tab-height);padding:0 20px 2px;border-left:2px solid var(--lightest-navy);background-color:transparent;color:var(--slate);font-family:var(--font-mono);font-size:var(--fz-xs);text-align:left;white-space:nowrap}.tab-button.svelte-1fydtat.svelte-1fydtat:hover,.tab-button.svelte-1fydtat.svelte-1fydtat:active,.tab-button.svelte-1fydtat.svelte-1fydtat:focus{color:var(--green);outline:0}.tab-button.active.svelte-1fydtat.svelte-1fydtat{color:var(--green)}@media(max-width: 768px){.tab-button.svelte-1fydtat.svelte-1fydtat{padding:0 15px 2px}}@media(max-width: 600px){.tab-button.svelte-1fydtat.svelte-1fydtat{display:flex;justify-content:center;align-items:center;min-width:120px;padding:0 15px;border-left:0;border-bottom:2px solid var(--lightest-navy);text-align:center}}.tab-button.svelte-1fydtat.svelte-1fydtat:hover,.tab-button.svelte-1fydtat.svelte-1fydtat:focus{background-color:var(--light-navy)}.highlight.svelte-1fydtat.svelte-1fydtat{--tab-id:0;position:absolute;top:0;left:0;z-index:10;width:2px;height:var(--tab-height);border-radius:var(--border-radius);background:var(--green);transform:translateY(calc(var(--tab-id) * var(--tab-height)));transition:transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);transition-delay:0.1s}@media(max-width: 600px){.highlight.svelte-1fydtat.svelte-1fydtat{top:auto;bottom:0;width:100%;max-width:var(--tab-width);height:2px;margin-left:50px;transform:translateX(calc(var(--tab-id) * var(--tab-width)))}}@media(max-width: 480px){.highlight.svelte-1fydtat.svelte-1fydtat{margin-left:25px}}.panels.svelte-1fydtat.svelte-1fydtat{position:relative;width:100%;margin-left:20px}@media(max-width: 600px){.panels.svelte-1fydtat.svelte-1fydtat{margin-left:0}}.panel.svelte-1fydtat.svelte-1fydtat{width:100%;height:auto;padding:10px 5px}.panel.svelte-1fydtat h3.svelte-1fydtat{margin-bottom:2px;font-size:var(--fz-xxl);font-weight:500;line-height:1.3}.panel.svelte-1fydtat h3 .company.svelte-1fydtat{color:var(--green)}.panel.svelte-1fydtat .range.svelte-1fydtat{margin-bottom:25px;color:var(--light-slate);font-family:var(--font-mono);font-size:var(--fz-xs)}.job-description.svelte-1fydtat ul{padding:0;margin:0;list-style:none;font-size:var(--fz-lg)}.job-description.svelte-1fydtat ul li{position:relative;padding-left:30px;margin-bottom:10px}.job-description.svelte-1fydtat ul li:before{content:\"▹\";position:absolute;left:0;color:var(--green)}",
	map: null
};

const Jobs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { jobs } = $$props;
	let activeTabId = 0;
	let tabs = new Array(jobs.length);

	if ($$props.jobs === void 0 && $$bindings.jobs && jobs !== void 0) $$bindings.jobs(jobs);
	$$result.css.add(css$2);

	return `<section id="${"jobs"}" class="${"scroll-reveal svelte-1fydtat"}"><h2 class="${"numbered-heading"}">Where I’ve Worked</h2>
    <div class="${"inner svelte-1fydtat"}"><div role="${"tablist"}" class="${"tablist svelte-1fydtat"}" aria-label="${"Job tabs"}">${each(jobs, ({ company }, i) => {
		return `<button class="${["tab-button svelte-1fydtat", activeTabId === i ? "active" : ""].join(' ').trim()}"${add_attribute("id", `tab-${i}`, 0)} role="${"tab"}"${add_attribute("tabindex", activeTabId === i ? 0 : -1, 0)}${add_attribute("aria-selected", activeTabId === i ? true : false, 0)}${add_attribute("aria-controls", `panel-${i}`, 0)}${add_attribute("this", tabs[i], 0)}><span>${escape(company)}</span>
                </button>`;
	})}
            <div class="${"highlight svelte-1fydtat"}" style="${"--tab-id: " + escape(activeTabId, true)}"></div></div>

      <div class="${"panels svelte-1fydtat"}">${each(jobs, ({ title, url, company, range, content }, i) => {
		return `<div class="${"panel svelte-1fydtat"}"${add_attribute("id", `panel-${i}`, 0)} role="${"tabpanel"}"${add_attribute("tabindex", activeTabId === i ? 0 : -1, 0)}${add_attribute("aria-labelledby", `tab-${i}`, 0)}${add_attribute("aria-hidden", activeTabId !== i, 0)} ${activeTabId !== i ? "hidden" : ""}><h3 class="${"svelte-1fydtat"}"><span>${escape(title)}</span>
                    <span class="${"company svelte-1fydtat"}"> @ 
                        <a${add_attribute("href", url, 0)} class="${"inline-link"}">${escape(company)}</a>
                    </span></h3>

                <p class="${"range svelte-1fydtat"}">${escape(range)}</p>

                <div class="${"job-description svelte-1fydtat"}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END --></div>
            </div>`;
	})}</div></div>
  </section>`;
});

const $$module1$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Jobs
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Jobs.astro", { modules: [{ module: $$module1$2, specifier: "../components/Jobs.svelte", assert: {} }], hydratedComponents: [Jobs], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["visible"]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Jobs.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Jobs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Jobs;
  const rawJobs = await Astro2.glob(
    /* #__PURE__ */ Object.assign({"../content/jobs/ExxonMobil/index.md": () => import('./chunks/index.6470036e.mjs'),"../content/jobs/PayPay/index.md": () => import('./chunks/index.4a86f67d.mjs')}),
    () => "../content/jobs/**/index.md"
  );
  const sortedRawJobs = rawJobs.sort(
    ({ frontmatter: { date: dateA } }, { frontmatter: { date: dateB } }) => new Date(dateB).valueOf() - new Date(dateA).valueOf()
  );
  const jobs = sortedRawJobs.map(
    ({ frontmatter: { title, url, company, range }, compiledContent }) => {
      return { title, url, company, range, content: compiledContent() };
    }
  );
  return renderTemplate`${renderComponent($$result, "Jobs", Jobs, { "client:visible": true, "jobs": jobs, "client:component-hydration": "visible", "client:component-path": "/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Jobs.svelte", "client:component-export": "default" })}`;
});

const $$file$5 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Jobs.astro";
const $$url$5 = undefined;

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$Jobs,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Featured.astro", { modules: [{ module: $$module1$3, specifier: "@astrojs/image/components", assert: {} }, { module: $$module2$2, specifier: "./icons/icon.svelte", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Featured.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Featured = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Featured;
  const relativePath = "featured";
  const rawFeatures = await Astro2.glob(
    /* #__PURE__ */ Object.assign({"../content/featured/Abolish112/index.md": () => import('./chunks/index.b654cf88.mjs'),"../content/featured/Portfolio/index.md": () => import('./chunks/index.0bb58ea6.mjs'),"../content/featured/YisYo/index.md": () => import('./chunks/index.613f2173.mjs')}),
    () => "../content/featured/**/index.md"
  );
  const sortedRawFeatures = rawFeatures.sort(
    ({ frontmatter: { date: dateA } }, { frontmatter: { date: dateB } }) => new Date(dateA).valueOf() - new Date(dateB).valueOf()
  );
  const featuredProjects = sortedRawFeatures.map(
    ({ file, frontmatter: { title, cover, tech, github, external, cta }, compiledContent }) => {
      return { title, img: getImageURL(file, cover), tech, github, external, cta, content: compiledContent() };
    }
  );
  function getImageURL(file, cover) {
    const folder = getRelativeFilePath(file, 2);
    const image = getRelativeFilePath(cover, 1);
    return relativePath + "/" + folder + "/" + image;
  }
  function getRelativeFilePath(file, indexFromEnd) {
    const folders = file.split("/");
    return folders[folders.length - indexFromEnd];
  }
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<section id="projects" class="astro-VKE63LH3">
    <h2 class="numbered-heading astro-VKE63LH3">
      Some Things I’ve Built
    </h2>

    ${featuredProjects && renderTemplate`<ul class="projects astro-VKE63LH3">
		${featuredProjects.map(({ folder, external, title, aspectRatio, tech, github, img, cta, content }, i) => renderTemplate`<li class="project astro-VKE63LH3">
                <div class="project-content astro-VKE63LH3">
					<div class="astro-VKE63LH3">
						<p class="project-overline astro-VKE63LH3">Featured Project</p>
	
						<h3 class="project-title astro-VKE63LH3">
							<a${addAttribute(external, "href")} class="astro-VKE63LH3">${title}</a>
						</h3>
	
						<div class="project-description astro-VKE63LH3">${markHTMLString(content)}</div>
		
						${tech.length && renderTemplate`<ul class="project-tech-list astro-VKE63LH3">
							${tech.map((tech2, i2) => renderTemplate`<li class="astro-VKE63LH3">${tech2}</li>`)}
							</ul>`}
		
						<div class="project-links astro-VKE63LH3">
							${cta && renderTemplate`<a${addAttribute(cta, "href")} aria-label="Course Link" class="cta astro-VKE63LH3">
								Learn More
							</a>`}
							${github && renderTemplate`<a${addAttribute(github, "href")} aria-label="GitHub Link" class="astro-VKE63LH3">
								${renderComponent($$result, "Icon", Icon, { "name": "GitHub", "class": "astro-VKE63LH3" })}
							</a>`}
							${external && !cta && renderTemplate`<a${addAttribute(external, "href")} aria-label="External Link" class="external astro-VKE63LH3">
								${renderComponent($$result, "Icon", Icon, { "name": "External", "class": "astro-VKE63LH3" })}
							</a>`}
						</div>
				  	</div>
              </div>

              <div class="project-image astro-VKE63LH3">
                <a${addAttribute(external ? external : github ? github : "#", "href")} class="astro-VKE63LH3">
					${renderComponent($$result, "Image", $$Image, { "src": import(`../assets/images/${img}`), "alt": "project screen capture", "class": "img astro-VKE63LH3" })}
                </a>
              </div>
            </li>`)}
    	</ul>`}
  </section>`;
});

const $$file$4 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Featured.astro";
const $$url$4 = undefined;

const $$module5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Featured,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/Blogs.svelte generated by Svelte v3.50.0 */

const css$1 = {
	code: "section.svelte-d8wzkj.svelte-d8wzkj{display:flex;flex-direction:column;align-items:center}section.svelte-d8wzkj h2.svelte-d8wzkj{font-size:clamp(24px, 5vw, var(--fz-heading))}section.svelte-d8wzkj .archive-link.svelte-d8wzkj{font-family:var(--font-mono);font-size:var(--fz-sm)}section.svelte-d8wzkj .archive-link.svelte-d8wzkj:after{bottom:0.1em}section.svelte-d8wzkj .articles-grid.svelte-d8wzkj{width:100%;list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit, minmax(min(275px, 100%), 1fr));grid-gap:15px;position:relative;margin-top:50px}section.svelte-d8wzkj .buttons.svelte-d8wzkj{display:flex;flex-direction:row;gap:16px}section.svelte-d8wzkj .button.svelte-d8wzkj{color:var(--green);background-color:transparent;border:1px solid var(--green);border-radius:var(--border-radius);font-size:var(--fz-xs);font-family:var(--font-mono);line-height:1;text-decoration:none;cursor:pointer;transition:var(--transition);padding:1.25rem 1.75rem;margin:80px auto 0}section.svelte-d8wzkj .button.svelte-d8wzkj:hover,section.svelte-d8wzkj .button.svelte-d8wzkj:focus,section.svelte-d8wzkj .button.svelte-d8wzkj:active{background-color:var(--green-tint);outline:none}section.svelte-d8wzkj .button.svelte-d8wzkj:after{display:none !important}li.svelte-d8wzkj.svelte-d8wzkj{position:relative;cursor:default;transition:var(--transition)}@media(prefers-reduced-motion: no-preference){li.svelte-d8wzkj:hover .article-inner.svelte-d8wzkj,li.svelte-d8wzkj:focus-within .article-inner.svelte-d8wzkj{transform:translateY(-7px)}}li.svelte-d8wzkj a.svelte-d8wzkj{position:relative;z-index:1}li.svelte-d8wzkj .article-inner.svelte-d8wzkj{box-shadow:0 10px 30px -15px var(--navy-shadow);transition:var(--transition);display:flex;justify-content:space-between;flex-direction:column;align-items:flex-start;position:relative;height:100%;padding:2rem 1.75rem;border-radius:var(--border-radius);background-color:var(--light-navy);transition:var(--transition);overflow:auto}li.svelte-d8wzkj .article-inner.svelte-d8wzkj:hover,li.svelte-d8wzkj .article-inner.svelte-d8wzkj:focus{box-shadow:0 20px 30px -15px var(--navy-shadow)}li.svelte-d8wzkj .article-title.svelte-d8wzkj{margin:0 0 10px;color:var(--lightest-slate);font-size:var(--fz-xxl)}li.svelte-d8wzkj .article-title a.svelte-d8wzkj{position:static}li.svelte-d8wzkj .article-title a.svelte-d8wzkj:before{content:\"\";display:block;position:absolute;z-index:0;width:100%;height:100%;top:0;left:0}li.svelte-d8wzkj .article-description.svelte-d8wzkj{color:var(--light-slate);font-size:17px}li.svelte-d8wzkj .article-description a.svelte-d8wzkj{display:inline-block;text-decoration:none;text-decoration-skip-ink:auto;position:relative;transition:var(--transition);color:var(--green)}li.svelte-d8wzkj .article-description a.svelte-d8wzkj:hover,li.svelte-d8wzkj .article-description a.svelte-d8wzkj:focus,li.svelte-d8wzkj .article-description a.svelte-d8wzkj:active{color:var(--green);outline:0}li.svelte-d8wzkj .article-description a.svelte-d8wzkj:hover:after,li.svelte-d8wzkj .article-description a.svelte-d8wzkj:focus:after,li.svelte-d8wzkj .article-description a.svelte-d8wzkj:active:after{width:100%}li.svelte-d8wzkj .article-description a.svelte-d8wzkj:after{content:\"\";display:block;width:0;height:1px;position:relative;bottom:0.37em;background-color:var(--green);transition:var(--transition);opacity:0.5}li.svelte-d8wzkj .article-tech-list.svelte-d8wzkj{display:flex;align-items:flex-end;flex-grow:1;flex-wrap:wrap;padding:0;margin:20px 0 0 0;list-style:none}li.svelte-d8wzkj .article-tech-list li.svelte-d8wzkj{font-family:var(--font-mono);font-size:var(--fz-xxs);line-height:1.75}li.svelte-d8wzkj .article-tech-list li.svelte-d8wzkj:not(:last-of-type){margin-right:15px}",
	map: null
};

const GRID_LIMIT$1 = 6;

const Blogs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let shownArticles;
	let { articles } = $$props;
	const firstSix = articles.slice(0, GRID_LIMIT$1);

	if ($$props.articles === void 0 && $$bindings.articles && articles !== void 0) $$bindings.articles(articles);
	$$result.css.add(css$1);
	shownArticles = firstSix;

	return `<section id="${"blogs"}" class="${"svelte-d8wzkj"}"><h2 class="${"svelte-d8wzkj"}">Blogs</h2>

    <a class="${"inline-link archive-link svelte-d8wzkj"}" href="${"https://totsawin-jangprasert.medium.com/"}" target="${"_blank"}" rel="${"noreferrer"}">view all
    </a>

    <ul class="${"articles-grid svelte-d8wzkj"}">${each(shownArticles, ({ categories, content, description, link, pubDate, title }, i) => {
		return `<li class="${"svelte-d8wzkj"}"><div class="${"article-inner svelte-d8wzkj"}"><header><h3 class="${"article-title svelte-d8wzkj"}"><a${add_attribute("href", link, 0)} target="${"_blank"}" rel="${"noreferrer"}" class="${"svelte-d8wzkj"}">${escape(title)}
                            </a></h3>
                
                        <div class="${"article-description svelte-d8wzkj"}"><!-- HTML_TAG_START -->${description.substring(0, description.indexOf('<figure>'))}<!-- HTML_TAG_END -->
                        </div></header>
            
                    <footer><ul class="${"article-tech-list svelte-d8wzkj"}">${each(categories, category => {
			return `<li class="${"svelte-d8wzkj"}">${escape(category)}</li>`;
		})}</ul>
                    </footer></div>
            </li>`;
	})}</ul>

    <div class="${"buttons svelte-d8wzkj"}"><button class="${"button svelte-d8wzkj"}">Show ${escape('More')}</button>
        ${``}</div>

</section>`;
});

const $$module1$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Blogs
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Blogs.astro", { modules: [{ module: $$module1$1, specifier: "../components/Blogs.svelte", assert: {} }], hydratedComponents: [Blogs], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["visible"]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Blogs.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Blogs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Blogs;
  const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@totsawin-jangprasert");
  const data = await response.json();
  const unsortedArticles = data.items;
  const articles = unsortedArticles.sort(
    ({ date: dateA }, { date: dateB }) => new Date(dateB).valueOf() - new Date(dateA).valueOf()
  );
  return renderTemplate`${renderComponent($$result, "Blogs", Blogs, { "client:visible": true, "articles": articles, "client:component-hydration": "visible", "client:component-path": "/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Blogs.svelte", "client:component-export": "default" })}`;
});

const $$file$3 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Blogs.astro";
const $$url$3 = undefined;

const $$module7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Blogs,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Contact.astro", { modules: [{ module: $$module1$7, specifier: "../config.js", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Contact.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Contact;
  const { email } = config;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<section id="contact" class="astro-OCDTN5TZ">
    <h2 class="numbered-heading overline astro-OCDTN5TZ">What’s Next?</h2>

    <h2 class="title astro-OCDTN5TZ">Get In Touch</h2>

    <p class="astro-OCDTN5TZ">
      Although I’m not currently looking for any new opportunities, my inbox is always open.
      Whether you have a question or just want to say hi, I’ll try my best to get back to you!
    </p>

    <a class="email-link astro-OCDTN5TZ"${addAttribute(`mailto:${email}`, "href")}>
      Say Hello
    </a>
  </section>`;
});

const $$file$2 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Contact.astro";
const $$url$2 = undefined;

const $$module8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$Contact,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/Projects.svelte generated by Svelte v3.50.0 */

const css = {
	code: "section.svelte-9nx3gu.svelte-9nx3gu{display:flex;flex-direction:column;align-items:center}section.svelte-9nx3gu h2.svelte-9nx3gu{font-size:clamp(24px, 5vw, var(--fz-heading))}section.svelte-9nx3gu .archive-link.svelte-9nx3gu{font-family:var(--font-mono);font-size:var(--fz-sm)}section.svelte-9nx3gu .archive-link.svelte-9nx3gu:after{bottom:0.1em}section.svelte-9nx3gu .projects-grid.svelte-9nx3gu{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));grid-gap:15px;position:relative;margin-top:50px}@media(max-width: 1080px){section.svelte-9nx3gu .projects-grid.svelte-9nx3gu{grid-template-columns:repeat(auto-fill, minmax(250px, 1fr))}}section.svelte-9nx3gu .more-button.svelte-9nx3gu{color:var(--green);background-color:transparent;border:1px solid var(--green);border-radius:var(--border-radius);font-size:var(--fz-xs);font-family:var(--font-mono);line-height:1;text-decoration:none;cursor:pointer;transition:var(--transition);padding:1.25rem 1.75rem;margin:80px auto 0}section.svelte-9nx3gu .more-button.svelte-9nx3gu:hover,section.svelte-9nx3gu .more-button.svelte-9nx3gu:focus,section.svelte-9nx3gu .more-button.svelte-9nx3gu:active{background-color:var(--green-tint);outline:none}section.svelte-9nx3gu .more-button.svelte-9nx3gu:after{display:none !important}li.svelte-9nx3gu.svelte-9nx3gu{position:relative;cursor:default;transition:var(--transition)}@media(prefers-reduced-motion: no-preference){li.svelte-9nx3gu:hover .project-inner.svelte-9nx3gu,li.svelte-9nx3gu:focus-within .project-inner.svelte-9nx3gu{transform:translateY(-7px)}}li.svelte-9nx3gu a.svelte-9nx3gu{position:relative;z-index:1}li.svelte-9nx3gu .project-inner.svelte-9nx3gu{box-shadow:0 10px 30px -15px var(--navy-shadow);transition:var(--transition);display:flex;justify-content:space-between;align-items:center;flex-direction:column;align-items:flex-start;position:relative;height:100%;padding:2rem 1.75rem;border-radius:var(--border-radius);background-color:var(--light-navy);transition:var(--transition);overflow:auto}li.svelte-9nx3gu .project-inner.svelte-9nx3gu:hover,li.svelte-9nx3gu .project-inner.svelte-9nx3gu:focus{box-shadow:0 20px 30px -15px var(--navy-shadow)}li.svelte-9nx3gu .project-top.svelte-9nx3gu{display:flex;justify-content:space-between;align-items:center;margin-bottom:35px}li.svelte-9nx3gu .project-top .folder.svelte-9nx3gu{color:var(--green)}li.svelte-9nx3gu .project-top .folder.svelte-9nx3gu svg{width:40px;height:40px}li.svelte-9nx3gu .project-top .project-links.svelte-9nx3gu{display:flex;align-items:center;margin-right:-10px;color:var(--light-slate)}li.svelte-9nx3gu .project-top .project-links a.svelte-9nx3gu{display:flex;justify-content:center;align-items:center;padding:5px 7px}li.svelte-9nx3gu .project-top .project-links a.external.svelte-9nx3gu svg{width:22px;height:22px;margin-top:-4px}li.svelte-9nx3gu .project-top .project-links a.svelte-9nx3gu svg{width:20px;height:20px}li.svelte-9nx3gu .project-title.svelte-9nx3gu{margin:0 0 10px;color:var(--lightest-slate);font-size:var(--fz-xxl)}li.svelte-9nx3gu .project-title a.svelte-9nx3gu{position:static}li.svelte-9nx3gu .project-title a.svelte-9nx3gu:before{content:\"\";display:block;position:absolute;z-index:0;width:100%;height:100%;top:0;left:0}li.svelte-9nx3gu .project-description.svelte-9nx3gu{color:var(--light-slate);font-size:17px}li.svelte-9nx3gu .project-description a.svelte-9nx3gu{display:inline-block;text-decoration:none;text-decoration-skip-ink:auto;position:relative;transition:var(--transition);color:var(--green)}li.svelte-9nx3gu .project-description a.svelte-9nx3gu:hover,li.svelte-9nx3gu .project-description a.svelte-9nx3gu:focus,li.svelte-9nx3gu .project-description a.svelte-9nx3gu:active{color:var(--green);outline:0}li.svelte-9nx3gu .project-description a.svelte-9nx3gu:hover:after,li.svelte-9nx3gu .project-description a.svelte-9nx3gu:focus:after,li.svelte-9nx3gu .project-description a.svelte-9nx3gu:active:after{width:100%}li.svelte-9nx3gu .project-description a.svelte-9nx3gu:after{content:\"\";display:block;width:0;height:1px;position:relative;bottom:0.37em;background-color:var(--green);transition:var(--transition);opacity:0.5}li.svelte-9nx3gu .project-tech-list.svelte-9nx3gu{display:flex;align-items:flex-end;flex-grow:1;flex-wrap:wrap;padding:0;margin:20px 0 0 0;list-style:none}li.svelte-9nx3gu .project-tech-list li.svelte-9nx3gu{font-family:var(--font-mono);font-size:var(--fz-xxs);line-height:1.75}li.svelte-9nx3gu .project-tech-list li.svelte-9nx3gu:not(:last-of-type){margin-right:15px}",
	map: null
};

const GRID_LIMIT = 6;

const Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let shownProjects;
	let { projects } = $$props;
	const firstSix = projects.slice(0, GRID_LIMIT);

	if ($$props.projects === void 0 && $$bindings.projects && projects !== void 0) $$bindings.projects(projects);
	$$result.css.add(css);
	shownProjects = firstSix;

	return `<section class="${"svelte-9nx3gu"}"><h2 class="${"svelte-9nx3gu"}">Other Noteworthy Projects</h2>

    <a class="${"inline-link archive-link svelte-9nx3gu"}" href="${"/archive"}">view the archive
    </a>

    <ul class="${"projects-grid svelte-9nx3gu"}">${each(shownProjects, ({ github, external, title, tech, content }, i) => {
		return `<li class="${"svelte-9nx3gu"}"><div class="${"project-inner svelte-9nx3gu"}"><header><div class="${"project-top svelte-9nx3gu"}"><div class="${"folder svelte-9nx3gu"}">${validate_component(Icon, "Icon").$$render($$result, { name: "Folder" }, {}, {})}</div>
                        <div class="${"project-links svelte-9nx3gu"}">${github
		? `<a${add_attribute("href", github, 0)} aria-label="${"GitHub Link"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"svelte-9nx3gu"}">${validate_component(Icon, "Icon").$$render($$result, { name: "GitHub" }, {}, {})}
                                </a>`
		: ``}
                            ${external
		? `<a${add_attribute("href", external, 0)} aria-label="${"External Link"}" class="${"external svelte-9nx3gu"}" target="${"_blank"}" rel="${"noreferrer"}">${validate_component(Icon, "Icon").$$render($$result, { name: "External" }, {}, {})}
                                </a>`
		: ``}
                        </div></div>
            
                      <h3 class="${"project-title svelte-9nx3gu"}"><a${add_attribute("href", external, 0)} target="${"_blank"}" rel="${"noreferrer"}" class="${"svelte-9nx3gu"}">${escape(title)}
                        </a></h3>
            
                      <div class="${"project-description svelte-9nx3gu"}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END -->
                      </div></header>
            
                    <footer><ul class="${"project-tech-list svelte-9nx3gu"}">${each(tech, techStack => {
			return `<li class="${"svelte-9nx3gu"}">${escape(techStack)}</li>`;
		})}</ul>
                    </footer></div>
            </li>`;
	})}</ul>

    <button class="${"more-button svelte-9nx3gu"}">Show ${escape('More')}</button>
  </section>`;
});

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Projects
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Projects.astro", { modules: [{ module: $$module1, specifier: "../components/Projects.svelte", assert: {} }], hydratedComponents: [Projects], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["visible"]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Projects.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Projects;
  const rawProjects = await Astro2.glob(
    /* #__PURE__ */ Object.assign({"../content/projects/AMFM.md": () => import('./chunks/AMFM.b19fee66.mjs'),"../content/projects/AlgoliaWordPressMediumPost.md": () => import('./chunks/AlgoliaWordPressMediumPost.e0407a01.mjs'),"../content/projects/AppleMusicEmbedPlayer.md": () => import('./chunks/AppleMusicEmbedPlayer.200588b9.mjs'),"../content/projects/Blistabloc.md": () => import('./chunks/Blistabloc.34d5128f.mjs'),"../content/projects/CourseSource.md": () => import('./chunks/CourseSource.5f4c0a28.mjs'),"../content/projects/CrowdDJ.md": () => import('./chunks/CrowdDJ.e63daaa9.mjs'),"../content/projects/Devoted.md": () => import('./chunks/Devoted.bf89a3ff.mjs'),"../content/projects/Flagship.md": () => import('./chunks/Flagship.72f053c9.mjs'),"../content/projects/Fontipsums.md": () => import('./chunks/Fontipsums.17a06cd2.mjs'),"../content/projects/GoogleKeepClone.md": () => import('./chunks/GoogleKeepClone.103fd3b2.mjs'),"../content/projects/HalcyonTheme.md": () => import('./chunks/HalcyonTheme.bcb99b59.mjs'),"../content/projects/HeadlessCMSMediumPost.md": () => import('./chunks/HeadlessCMSMediumPost.3449c6d1.mjs'),"../content/projects/Interventions.md": () => import('./chunks/Interventions.f0233c98.mjs'),"../content/projects/JetBlueHumanKinda.md": () => import('./chunks/JetBlueHumanKinda.63723c22.mjs'),"../content/projects/KoalaHealth.md": () => import('./chunks/KoalaHealth.018f209e.mjs'),"../content/projects/LonelyPlanetDBMS.md": () => import('./chunks/LonelyPlanetDBMS.667e4334.mjs'),"../content/projects/MichelleWu.md": () => import('./chunks/MichelleWu.8fad12e3.mjs'),"../content/projects/MomsDemandAction.md": () => import('./chunks/MomsDemandAction.e118ad9d.mjs'),"../content/projects/MyNEURedesign.md": () => import('./chunks/MyNEURedesign.535b4f0d.mjs'),"../content/projects/NUWITSite.md": () => import('./chunks/NUWITSite.e43dd9d4.mjs'),"../content/projects/NortheasternCSSH.md": () => import('./chunks/NortheasternCSSH.2d9dd7a3.mjs'),"../content/projects/OctoProfile.md": () => import('./chunks/OctoProfile.af941935.mjs'),"../content/projects/OneCardForAll.md": () => import('./chunks/OneCardForAll.378eceeb.mjs'),"../content/projects/PhillySports.md": () => import('./chunks/PhillySports.7eb7ff4a.mjs'),"../content/projects/ReactResume.md": () => import('./chunks/ReactResume.f33e414e.mjs'),"../content/projects/Screentime.md": () => import('./chunks/Screentime.86ed5250.mjs'),"../content/projects/SpotifyProfile.md": () => import('./chunks/SpotifyProfile.cb1b61e6.mjs'),"../content/projects/SpotifyTopTracks2017.md": () => import('./chunks/SpotifyTopTracks2017.b363a7cc.mjs'),"../content/projects/The19th.md": () => import('./chunks/The19th.799fd659.mjs'),"../content/projects/TimeToHaveMoreFun.md": () => import('./chunks/TimeToHaveMoreFun.edde9a4d.mjs'),"../content/projects/UpstatementDotCom.md": () => import('./chunks/UpstatementDotCom.1827f173.mjs'),"../content/projects/Vanderbilt.md": () => import('./chunks/Vanderbilt.56a1a05c.mjs'),"../content/projects/WeatherWidget.md": () => import('./chunks/WeatherWidget.8286c34f.mjs'),"../content/projects/v1.md": () => import('./chunks/v1.bd778442.mjs'),"../content/projects/v2.md": () => import('./chunks/v2.2752aba8.mjs'),"../content/projects/v3.md": () => import('./chunks/v3.f972c909.mjs')}),
    () => "../content/projects/*.md"
  );
  const sortedandfilteredRawProjects = rawProjects.filter((project) => project.frontmatter.showInProjects !== false).sort(
    ({ frontmatter: { date: dateA } }, { frontmatter: { date: dateB } }) => new Date(dateB).valueOf() - new Date(dateA).valueOf()
  );
  const projects = sortedandfilteredRawProjects.map(
    ({ frontmatter: { title, tech, github, external }, compiledContent }) => {
      return { title, tech, github, external, content: compiledContent() };
    }
  );
  return renderTemplate`${renderComponent($$result, "Projects", Projects, { "client:visible": true, "projects": projects, "client:component-hydration": "visible", "client:component-path": "/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Projects.svelte", "client:component-export": "default" })}`;
});

const $$file$1 = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Projects.astro";
const $$url$1 = undefined;

const $$module6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$Projects,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/pages/index.astro", { modules: [{ module: $$module1$5, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Hero.astro", assert: {} }, { module: $$module3, specifier: "../components/About.astro", assert: {} }, { module: $$module4, specifier: "../components/Jobs.astro", assert: {} }, { module: $$module5, specifier: "../components/Featured.astro", assert: {} }, { module: $$module6, specifier: "../components/Projects.astro", assert: {} }, { module: $$module7, specifier: "../components/Blogs.astro", assert: {} }, { module: $$module8, specifier: "../components/Contact.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/pages/index.astro", "", "file:///Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const seoProps = {
    metadescription: "Totsawin Jangprasert is a frontend developer",
    title: `Totsawin Jangprasert's Portfolio`,
    location: Astro2.url
  };
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { ...seoProps, "class": "astro-CLFCGYZA" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="fillHeight astro-CLFCGYZA">
		${renderComponent($$result, "Hero", $$Hero, { "class": "astro-CLFCGYZA" })}
		${renderComponent($$result, "About", $$About, { "class": "astro-CLFCGYZA" })}
		${renderComponent($$result, "Jobs", $$Jobs, { "class": "astro-CLFCGYZA" })}
		${renderComponent($$result, "Featured", $$Featured, { "class": "astro-CLFCGYZA" })}
		<!-- <Projects /> -->
		${renderComponent($$result, "Blogs", $$Blogs, { "class": "astro-CLFCGYZA" })}
		${renderComponent($$result, "Contact", $$Contact, { "class": "astro-CLFCGYZA" })}
	</main>` })}

`;
});

const $$file = "/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/pages/index.astro";
const $$url = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['node_modules/@astrojs/image/dist/endpoint.js', _page0],['src/pages/index.astro', _page1],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/svelte","clientEntrypoint":"@astrojs/svelte/client.js","serverEntrypoint":"@astrojs/svelte/server.js"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.d4738d66.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/jobs/ExxonMobil/index.md":"chunks/index.6470036e.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/jobs/PayPay/index.md":"chunks/index.4a86f67d.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/featured/Abolish112/index.md":"chunks/index.b654cf88.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/featured/Portfolio/index.md":"chunks/index.0bb58ea6.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/featured/YisYo/index.md":"chunks/index.613f2173.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/AMFM.md":"chunks/AMFM.b19fee66.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/AlgoliaWordPressMediumPost.md":"chunks/AlgoliaWordPressMediumPost.e0407a01.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/AppleMusicEmbedPlayer.md":"chunks/AppleMusicEmbedPlayer.200588b9.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Blistabloc.md":"chunks/Blistabloc.34d5128f.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/CourseSource.md":"chunks/CourseSource.5f4c0a28.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/CrowdDJ.md":"chunks/CrowdDJ.e63daaa9.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Devoted.md":"chunks/Devoted.bf89a3ff.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Flagship.md":"chunks/Flagship.72f053c9.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Fontipsums.md":"chunks/Fontipsums.17a06cd2.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/GoogleKeepClone.md":"chunks/GoogleKeepClone.103fd3b2.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/HalcyonTheme.md":"chunks/HalcyonTheme.bcb99b59.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/HeadlessCMSMediumPost.md":"chunks/HeadlessCMSMediumPost.3449c6d1.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Interventions.md":"chunks/Interventions.f0233c98.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/JetBlueHumanKinda.md":"chunks/JetBlueHumanKinda.63723c22.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/KoalaHealth.md":"chunks/KoalaHealth.018f209e.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/LonelyPlanetDBMS.md":"chunks/LonelyPlanetDBMS.667e4334.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/MichelleWu.md":"chunks/MichelleWu.8fad12e3.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/MomsDemandAction.md":"chunks/MomsDemandAction.e118ad9d.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/MyNEURedesign.md":"chunks/MyNEURedesign.535b4f0d.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/NUWITSite.md":"chunks/NUWITSite.e43dd9d4.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/NortheasternCSSH.md":"chunks/NortheasternCSSH.2d9dd7a3.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/OctoProfile.md":"chunks/OctoProfile.af941935.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/OneCardForAll.md":"chunks/OneCardForAll.378eceeb.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/PhillySports.md":"chunks/PhillySports.7eb7ff4a.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/ReactResume.md":"chunks/ReactResume.f33e414e.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Screentime.md":"chunks/Screentime.86ed5250.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/SpotifyProfile.md":"chunks/SpotifyProfile.cb1b61e6.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/SpotifyTopTracks2017.md":"chunks/SpotifyTopTracks2017.b363a7cc.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/The19th.md":"chunks/The19th.799fd659.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/TimeToHaveMoreFun.md":"chunks/TimeToHaveMoreFun.edde9a4d.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/UpstatementDotCom.md":"chunks/UpstatementDotCom.1827f173.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/Vanderbilt.md":"chunks/Vanderbilt.56a1a05c.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/WeatherWidget.md":"chunks/WeatherWidget.8286c34f.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/v1.md":"chunks/v1.bd778442.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/v2.md":"chunks/v2.2752aba8.mjs","/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/content/projects/v3.md":"chunks/v3.f972c909.mjs","/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Nav.svelte":"Nav.649bbb3a.js","/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Content.svelte":"Content.2093ecb2.js","/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Jobs.svelte":"Jobs.166f742f.js","/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Blogs.svelte":"Blogs.fbc6b7cf.js","/@fs/Users/totsawinjangprasert/Documents/web/personal/portfolio/portfolio/src/components/Projects.svelte":"Projects.4aca1054.js","@astrojs/svelte/client.js":"client.b27523fa.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/me.ce158c08.jpg","/assets/index.d4738d66.css","/Blogs.fbc6b7cf.js","/Content.2093ecb2.js","/Jobs.166f742f.js","/Nav.649bbb3a.js","/Projects.4aca1054.js","/client.b27523fa.js","/favicon.svg","/resume.pdf","/assets/Projects.d8ed6fd7.css","/chunks/index.3abed11f.js","/chunks/logo.91843197.js","/chunks/store.eb998381.js","/chunks/utils.2b1ff2c7.js","/favicons/android-icon-144x144.png","/favicons/android-icon-192x192.png","/favicons/android-icon-36x36.png","/favicons/android-icon-48x48.png","/favicons/android-icon-72x72.png","/favicons/android-icon-96x96.png","/favicons/apple-icon-114x114.png","/favicons/apple-icon-120x120.png","/favicons/apple-icon-144x144.png","/favicons/apple-icon-152x152.png","/favicons/apple-icon-180x180.png","/favicons/apple-icon-57x57.png","/favicons/apple-icon-60x60.png","/favicons/apple-icon-72x72.png","/favicons/apple-icon-76x76.png","/favicons/apple-icon-precomposed.png","/favicons/apple-icon.png","/favicons/browserconfig.xml","/favicons/favicon-16x16.png","/favicons/favicon-32x32.png","/favicons/favicon-96x96.png","/favicons/favicon.ico","/favicons/manifest.json","/favicons/ms-icon-144x144.png","/favicons/ms-icon-150x150.png","/favicons/ms-icon-310x310.png","/favicons/ms-icon-70x70.png","/fonts/Calibre/Calibre-Light.ttf","/fonts/Calibre/Calibre-Light.woff","/fonts/Calibre/Calibre-Light.woff2","/fonts/Calibre/Calibre-LightItalic.ttf","/fonts/Calibre/Calibre-LightItalic.woff","/fonts/Calibre/Calibre-LightItalic.woff2","/fonts/Calibre/Calibre-Medium.ttf","/fonts/Calibre/Calibre-Medium.woff","/fonts/Calibre/Calibre-Medium.woff2","/fonts/Calibre/Calibre-MediumItalic.ttf","/fonts/Calibre/Calibre-MediumItalic.woff","/fonts/Calibre/Calibre-MediumItalic.woff2","/fonts/Calibre/Calibre-Regular.ttf","/fonts/Calibre/Calibre-Regular.woff","/fonts/Calibre/Calibre-Regular.woff2","/fonts/Calibre/Calibre-RegularItalic.ttf","/fonts/Calibre/Calibre-RegularItalic.woff","/fonts/Calibre/Calibre-RegularItalic.woff2","/fonts/Calibre/Calibre-Semibold.ttf","/fonts/Calibre/Calibre-Semibold.woff","/fonts/Calibre/Calibre-Semibold.woff2","/fonts/Calibre/Calibre-SemiboldItalic.ttf","/fonts/Calibre/Calibre-SemiboldItalic.woff","/fonts/Calibre/Calibre-SemiboldItalic.woff2","/fonts/SFMono/SFMono-Medium.ttf","/fonts/SFMono/SFMono-Medium.woff","/fonts/SFMono/SFMono-Medium.woff2","/fonts/SFMono/SFMono-MediumItalic.ttf","/fonts/SFMono/SFMono-MediumItalic.woff","/fonts/SFMono/SFMono-MediumItalic.woff2","/fonts/SFMono/SFMono-Regular.ttf","/fonts/SFMono/SFMono-Regular.woff","/fonts/SFMono/SFMono-Regular.woff2","/fonts/SFMono/SFMono-RegularItalic.ttf","/fonts/SFMono/SFMono-RegularItalic.woff","/fonts/SFMono/SFMono-RegularItalic.woff2","/fonts/SFMono/SFMono-Semibold.ttf","/fonts/SFMono/SFMono-Semibold.woff","/fonts/SFMono/SFMono-Semibold.woff2","/fonts/SFMono/SFMono-SemiboldItalic.ttf","/fonts/SFMono/SFMono-SemiboldItalic.woff","/fonts/SFMono/SFMono-SemiboldItalic.woff2"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { Fragment as F, createVNode as c, handler };

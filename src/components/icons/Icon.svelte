<script>
import {
  IconAppStore,
  IconBookmark,
  IconCodepen,
  IconExternal,
  IconFolder,
  IconFork,
  IconGitHub,
  IconInstagram,
  IconLinkedin,
  IconLoader,
  IconLogo,
  IconMedium,
  IconFacebook,
  IconPlayStore,
  IconStar,
  IconTwitter,
} from './index.js';
export let name;
let Component;
switch (name) {
    case 'AppStore':
        Component = IconAppStore;
        break;
    case 'Bookmark':
        Component = IconBookmark;
        break;
    case 'Codepen':
        Component = IconCodepen;
        break;
    case 'External':
        Component = IconExternal;
        break;
    case 'Facebook':
        Component = IconFacebook;
        break;
    case 'Folder':
        Component = IconFolder;
        break;
    case 'Fork':
        Component = IconFork;
        break;
    case 'GitHub':
        Component = IconGitHub;
        break;
    case 'Instagram':
        Component = IconInstagram;
        break;
    case 'Linkedin':
        Component = IconLinkedin;
        break;
    case 'Loader':
        Component = IconLoader;
        break;
    case 'Logo':
        Component = IconLogo;
    case 'Medium':
        Component = IconMedium;
        break;
    case 'PlayStore':
        Component = IconPlayStore;
        break;
    case 'Star':
        Component = IconStar;
    case 'Twitter':
        Component = IconTwitter;
        break;
    default:
        Component = IconExternal;
};
</script>
<Component />
<script lang="ts">
    import { isMobileMenuOpen } from '../store.js';
    import config from "../config.js";
    import Menu from "./Menu.svelte";
    import IconLogo from "./icons/logo.svelte";
    const { navLinks } = config;
    import { onMount, onDestroy } from 'svelte';
    export let isHome: boolean;
    const delay = isHome ? '3000ms' : '0ms';
    const duration = isHome ? '300ms' : '0ms';
    const isRenderingOnServer = typeof window === 'undefined';
    let lastScrollY = isRenderingOnServer ? 0: window.pageYOffset;
    let scrollDirection = 'down';
    let scrolledToTop = true;

    onMount(() => {
        if(isRenderingOnServer){
            return;
        }
		window.addEventListener('scroll', handleScroll);
	});

    onDestroy(() => {
        if(isRenderingOnServer){
            return;
        }
		window.removeEventListener('scroll', handleScroll);
	});
    
    function handleScroll() {
        const scrollY = window.pageYOffset;
        scrolledToTop = isScrolledToTop(scrollY)
        scrollDirection = getScrollDirection(scrollY);
        lastScrollY = scrollY > 0 ? scrollY : 0;
    }
    function isScrolledToTop(scrollY: number) {
        return scrollY < 50;
    }
    function getScrollDirection(scrollY: number) {
        const SCROLL_UP = 'up';
        const SCROLL_DOWN = 'down';
        return scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP;
    }
</script>

<header 
    class="{scrolledToTop ? '': (scrollDirection === 'up' ? 'scroll-up' : 'scroll-down')}" 
    class:transparent={$isMobileMenuOpen}
    style="--delay: {delay}; --duration: {duration};"
>
    <nav>
        <div class="logo" tabIndex="-1">
            <a href="/" aria-label="home">
                <IconLogo />
            </a>
        </div>
        <div class="links">
            <ol>
                {#each navLinks as { url, name }, index}
                    <li style:--delay-items={isHome ? index: 0}>
                        <a href={url}>{name}</a>
                    </li>
                {/each}
            </ol>
            <div class="resume-button-section" style:--delay-items={isHome ? navLinks.length: 0}>
                <a class="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    Resume
                </a>
            </div>
        </div>

        <Menu />
    </nav>
</header>

<style lang="scss">
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fade-down {
        from {
            opacity: 0.01;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0px);
        }
    }
    header {
        --delay-items: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        z-index: 11;
        padding: 0px 50px;
        width: 100%;
        height: var(--nav-height);
        background-color: rgba(10, 25, 47, 0.85);
        filter: none !important;
        pointer-events: auto !important;
        user-select: auto !important;
        backdrop-filter: blur(10px);
        transition: var(--transition);
        &.transparent {
            background-color: transparent;
        }
        
        @media (max-width: 1080px) {
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            padding: 0 25px;
        }

        @media (prefers-reduced-motion: no-preference) {
            &.scroll-up {
                height: var(--nav-scroll-height);
                transform: translateY(0px);
                background-color: rgba(10, 25, 47, 0.85);
                box-shadow: 0 10px 30px -10px var(--navy-shadow);
            }
            &.scroll-down {
                height: var(--nav-scroll-height);
                transform: translateY(calc(var(--nav-scroll-height) * -1));
                box-shadow: 0 10px 30px -10px var(--navy-shadow);
            }
        }
    }
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 100%;
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        counter-reset: item 0;
        z-index: 12;

        .logo {
            display: flex;
            justify-content: center;
            align-items: center;

            a {
                color: var(--green);
                width: 42px;
                height: 42px;

                &:hover,
                &:focus {
                    :global(svg) {
                        fill: var(--green-tint);
                    }
                }

                :global(svg) {
                    fill: none;
                    transition: var(--transition);
                    user-select: none;
                }
            }

            @media (prefers-reduced-motion: no-preference) {
                animation: fade var(--easing);
                animation-duration: var(--duration);
                animation-delay: var(--delay);
                animation-fill-mode: backwards;
            }
        }
    }
    .links {
        display: flex;
        align-items: center;

        @media (max-width: 768px) {
            display: none;
        }

        ol {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin: 0;
            list-style: none;

            li {
                margin: 0 5px;
                position: relative;
                counter-increment: item 1;
                font-size: var(--fz-xs);

                a {
                    padding: 10px;

                    &:before {
                    content: '0' counter(item) '.';
                    margin-right: 5px;
                    color: var(--green);
                    font-size: var(--fz-xxs);
                    text-align: right;
                    }
                }

                @media (prefers-reduced-motion: no-preference) {
                    animation: fade-down var(--easing);
                    animation-duration: var(--duration);
                    animation-delay: calc(var(--delay) + var(--delay-items) * 100ms);
                    animation-fill-mode: backwards;
                }
            }
        }

        .resume-button-section {
            @media (prefers-reduced-motion: no-preference) {
                animation: fade-down var(--easing);
                animation-duration: var(--duration);
                animation-delay: calc(var(--delay) + var(--delay-items) * 100ms);
                animation-fill-mode: backwards;
            }
        }

        .resume-button {
            color: var(--green);
            background-color: transparent;
            border: 1px solid var(--green);
            border-radius: var(--border-radius);
            padding: 0.75rem 1rem;
            font-size: var(--fz-xs);
            font-family: var(--font-mono);
            line-height: 1;
            text-decoration: none;
            cursor: pointer;
            transition: var(--transition);
            &:hover,
            &:focus,
            &:active {
                background-color: var(--green-tint);
                outline: none;
            }
            &:after {
                display: none !important;
            }
            margin-left: 15px;
            font-size: var(--fz-xs);
        }
    }
</style>
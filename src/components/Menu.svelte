<script lang="ts">
  import { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } from '../store.js';
  import config from "../config.js";
  // import KEY_CODES from "../utils.js";
  const { navLinks} = config;
</script>

<div class="menu">
  <div>
    <button
      class="hamburger-button"
      on:click={() => toggleMobileMenu()}
      aria-label="Menu"
    >
      <div class="ham-box">
        <div class="ham-box-inner" class:menuOpen={$isMobileMenuOpen} />
      </div>
    </button>

    <aside aria-hidden={!$isMobileMenuOpen} tabIndex={$isMobileMenuOpen ? 1 : -1} class:menuOpen={$isMobileMenuOpen}>
      <nav>
        <ol>
          {#each navLinks as { url, name }}
            <li>
              <a href={url} on:click={() => setMobileMenuOpen(false)}>{name}</a>
            </li>
          {/each}
        </ol>
        <a href="/resume.pdf" class="resume-link"> Resume </a>
      </nav>
    </aside>
  </div>
</div>

<style lang="scss">
  .menu {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }

  .hamburger-button {
    display: none;

    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 10;
      margin-right: -15px;
      padding: 15px;
      border: 0;
      background-color: transparent;
      color: inherit;
      text-transform: none;
      transition-timing-function: linear;
      transition-duration: 0.15s;
      transition-property: opacity, filter;
    }

    .ham-box {
      display: inline-block;
      position: relative;
      width: var(--hamburger-width);
      height: 24px;
    }

    .ham-box-inner {
      --bottom: `0`;
      position: absolute;
      top: 50%;
      right: 0;
      width: var(--hamburger-width);
      height: 2px;
      border-radius: var(--border-radius);
      background-color: var(--green);
      transition-duration: 0.22s;
      transition-property: transform;
      transition-delay: 0s;
      transform: rotate(0deg);
      transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      &:before,
      &:after {
        content: "";
        display: block;
        position: absolute;
        left: auto;
        right: 0;
        width: var(--hamburger-width);
        height: 2px;
        border-radius: 4px;
        background-color: var(--green);
        transition-timing-function: ease;
        transition-duration: 0.15s;
        transition-property: transform;
      }
      &:before {
        width: 120%;
        top: -10px;
        opacity: 1;
        transition: var(--ham-before);
      }
      &:after {
        width: 80%;
        bottom: -10px;
        transform: 0;
        transition: var(--ham-after);
      }
    }
    .menuOpen {
        transition-delay: 0.12s;
        transform: rotate(225deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        &:before { 
          width: 100%;
          top: 0;
          opacity: 0;
          transition: var(--ham-before-active);
        }
        &:after {
          width: 100%;
          bottom: 0;
          transform: rotate(-90deg);
          transition: var(--ham-after-active);
        }
      }
  }
  aside {
    display: none;

    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      padding: 50px 10px;
      width: min(75vw, 400px);
      height: 100vh;
      outline: 0;
      background-color: var(--light-navy);
      box-shadow: -10px 0px 30px -15px var(--navy-shadow);
      z-index: 9;
      transform: translateX(100vw);
      visibility: hidden;
      transition: var(--transition);

      &.menuOpen {
        transform: translateX(0vw);
        visibility: visible;
      }
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-direction: column;
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      text-align: center;
    }

    ol {
      padding: 0;
      margin: 0;
      list-style: none;
      width: 100%;

      li {
        position: relative;
        margin: 0 auto 20px;
        counter-increment: item 1;
        font-size: clamp(var(--fz-sm), 4vw, var(--fz-lg));

        @media (max-width: 600px) {
          margin: 0 auto 10px;
        }

        &:before {
          content: "0" counter(item) ".";
          display: block;
          margin-bottom: 5px;
          color: var(--green);
          font-size: var(--fz-sm);
        }
      }

      a {
        display: inline-block;
        text-decoration: none;
        text-decoration-skip-ink: auto;
        color: inherit;
        position: relative;
        transition: var(--transition);
        &:hover,
        &:active,
        &:focus {
          color: var(--green);
          outline: 0;
        }
        width: 100%;
        padding: 3px 20px 20px;
      }
    }
    .resume-link {
      color: var(--green);
      background-color: transparent;
      border: 1px solid var(--green);
      border-radius: var(--border-radius);
      padding: 1.25rem 1.75rem;
      font-size: var(--fz-sm);
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
      padding: 18px 50px;
      margin: 10% auto 0;
      width: max-content;
    }
  }
</style>
<script lang="ts">
    import { isMobileMenuOpen } from '../store.js';
</script>
<div id="content" class:blur={$isMobileMenuOpen}>
    <slot />
</div>

<style lang="scss">
    .blur {
        & :global(*) {
            filter: blur(1px) brightness(0.9);
            transition: var(--transition);
            pointer-events: none;
            user-select: none;
        }
    }
</style>
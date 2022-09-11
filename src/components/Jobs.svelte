<script lang="ts">
    import { KEY_CODES } from "../utils.js";
    export let jobs;
    let activeTabId = 0;
    let tabFocusIndex: number | null = null;
    let tabs: HTMLButtonElement[] = new Array(jobs.length);
    function setActiveTabId(id: number) {
        activeTabId = id;
        setTabFocus(id);
    }

    // Focus on tabs when using up & down arrow keys
    function onKeyDown(e: KeyboardEvent) {
        switch (e.key) {
            case KEY_CODES.ARROW_UP: {
                e.preventDefault();
                setTabFocus(tabFocusIndex as number - 1);
                break;
            }

            case KEY_CODES.ARROW_DOWN: {
                e.preventDefault();
                setTabFocus(tabFocusIndex as number + 1);
                break;
            }

            default: {
                break;
            }
        }
    }

    function setTabFocus(tabIndex: number){
        tabFocusIndex = tabIndex;
        focusTab();
    }

    function focusTab() {
        if (tabs[tabFocusIndex as number]) {
            tabs[tabFocusIndex as number].focus();
            return;
        }
        // If we're at the end, go to the start
        if (tabFocusIndex as number >= tabs.length) {
            setTabFocus(0);
        }
        // If we're at the start, move to the end
        if (tabFocusIndex as number < 0) {
            setTabFocus(tabs.length - 1);
        }
    }

</script>
<section id="jobs" class="scroll-reveal">
    <h2 class="numbered-heading">Where I’ve Worked</h2>
    <div class="inner">
        <div role="tablist" class="tablist" aria-label="Job tabs" on:keydown={e => onKeyDown(e)}>
            {#each jobs as { company }, i}
                <button class="tab-button"
                    class:active={activeTabId === i}
                    on:click={() => setActiveTabId(i)}
                    bind:this={tabs[i]}
                    id={`tab-${i}`}
                    role="tab"
                    tabindex={activeTabId === i ? 0 : -1}
                    aria-selected={activeTabId === i ? true : false}
                    aria-controls={`panel-${i}`}>
                    <span>{company}</span>
                </button>
            {/each}
            <div 
                class="highlight" 
                style="--tab-id: {activeTabId}"
            ></div>
        </div>

      <div class="panels">
        {#each jobs as { title, url, company, range, content }, i}
            <div
                class="panel"
                id={`panel-${i}`}
                role="tabpanel"
                tabindex={activeTabId === i ? 0 : -1}
                aria-labelledby={`tab-${i}`}
                aria-hidden={activeTabId !== i}
                hidden={activeTabId !== i}>
                <h3>
                    <span>{title}</span>
                    <span class="company">
                        &nbsp;@&nbsp;
                        <a href={url} class="inline-link">
                        {company}
                        </a>
                    </span>
                </h3>

                <p class="range">{range}</p>

                <div class="job-description">
                    { @html content }
                </div>
            </div>
        {/each}
      </div>
    </div>
  </section>


<style lang="scss">
    
    section {
        max-width: 700px;
    
        .inner {
            display: flex;
    
            @media (max-width: 600px) {
                display: block;
            }
    
            // Prevent container from jumping
            @media (min-width: 700px) {
                min-height: 340px;
            }
        }
    }
    
    .tablist {
        position: relative;
        z-index: 3;
        width: max-content;
        padding: 0;
        margin: 0;
        list-style: none;
    
        @media (max-width: 600px) {
            display: flex;
            overflow-x: auto;
            width: calc(100% + 100px);
            padding-left: 50px;
            margin-left: -50px;
            margin-bottom: 30px;
        }
        @media (max-width: 480px) {
            width: calc(100% + 50px);
            padding-left: 25px;
            margin-left: -25px;
        }
    
        li {
            &:first-of-type {
            @media (max-width: 600px) {
                margin-left: 50px;
            }
            @media (max-width: 480px) {
                margin-left: 25px;
            }
            }
            &:last-of-type {
            @media (max-width: 600px) {
                padding-right: 50px;
            }
            @media (max-width: 480px) {
                padding-right: 25px;
            }
            }
        }
    }
    .tab-button {
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
        display: flex;
        align-items: center;
        width: 100%;
        height: var(--tab-height);
        padding: 0 20px 2px;
        border-left: 2px solid var(--lightest-navy);
        background-color: transparent;
        color: var(--slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        text-align: left;
        white-space: nowrap;

        &.active {
            color: var(--green);
        }
    
        @media (max-width: 768px) {
            padding: 0 15px 2px;
        }
        @media (max-width: 600px) {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 120px;
            padding: 0 15px;
            border-left: 0;
            border-bottom: 2px solid var(--lightest-navy);
            text-align: center;
        }
    
        &:hover,
        &:focus {
            background-color: var(--light-navy);
        }
    }
    
    .highlight {
        --tab-id: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 2px;
        height: var(--tab-height);
        border-radius: var(--border-radius);
        background: var(--green);
        transform: translateY(calc(var(--tab-id) * var(--tab-height)));
        transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition-delay: 0.1s;
    
        @media (max-width: 600px) {
            top: auto;
            bottom: 0;
            width: 100%;
            max-width: var(--tab-width);
            height: 2px;
            margin-left: 50px;
            transform: translateX(calc(var(--tab-id)  * var(--tab-width)));
        }
        @media (max-width: 480px) {
            margin-left: 25px;
        }
    }
    
    .panels {
        position: relative;
        width: 100%;
        margin-left: 20px;
    
        @media (max-width: 600px) {
            margin-left: 0;
        }
    }
    
    .panel {
        width: 100%;
        height: auto;
        padding: 10px 5px;
    
        h3 {
            margin-bottom: 2px;
            font-size: var(--fz-xxl);
            font-weight: 500;
            line-height: 1.3;
    
            .company {
            color: var(--green);
            }
        }
    
        .range {
            margin-bottom: 25px;
            color: var(--light-slate);
            font-family: var(--font-mono);
            font-size: var(--fz-xs);
        }
    }

    .job-description :global(ul) {
        padding: 0;
        margin: 0;
        list-style: none;
        font-size: var(--fz-lg);
        :global(li) {
            position: relative;
            padding-left: 30px;
            margin-bottom: 10px;
            &:before {
                content: '▹';
                position: absolute;
                left: 0;
                color: var(--green);
            }
        }
    }
</style>
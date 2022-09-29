<script lang="ts">
    import IconGitHub from "./icons/github.svelte";
    import IconExternal from "./icons/external.svelte";
    import IconFolder from "./icons/folder.svelte";
    interface Project {
        external: string;
        title: string;
        tech: string[];
        github: string;
        content: string;
    };
    export let projects: Project[];
    const GRID_LIMIT = 6;
    let showMore = false;
    const firstSix = projects.slice(0, GRID_LIMIT);
    $: shownProjects = showMore ? projects : firstSix;

    function setShowMore(flag: boolean){
        showMore = flag;
    }
</script>
<section id="projects">
    <h2 class="scroll-reveal">Other Noteworthy Projects</h2>

    <a class="inline-link archive-link scroll-reveal" href="/archive">
      view the archive
    </a>

    <ul class="projects-grid">
        {#each shownProjects as { github, external, title, tech, content }, i}
            <li class="scroll-reveal">
                <div class="project-inner">
                    <header>
                      <div class="project-top">
                        <div class="folder">
                          <IconFolder />
                        </div>
                        <div class="project-links">
                            {#if github}
                                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                                <IconGitHub />
                                </a>
                            {/if}
                            {#if external}
                                <a
                                href={external}
                                aria-label="External Link"
                                class="external"
                                target="_blank"
                                rel="noreferrer">
                                <IconExternal />
                                </a>
                            {/if}
                        </div>
                      </div>
            
                      <h3 class="project-title">
                        <a href={external} target="_blank" rel="noreferrer">
                          {title}
                        </a>
                      </h3>
            
                      <div class="project-description" >
                        { @html content }
                      </div>
                    </header>
            
                    <footer>
                        <ul class="project-tech-list">
                            {#each tech as techStack }
                                <li>{techStack}</li>
                            {/each}
                        </ul>
                    </footer>
                </div>
            </li>
        {/each}
    </ul>

    <button class="more-button" on:click={() => setShowMore(!showMore)}>
      Show {showMore ? 'Less' : 'More'}
    </button>
  </section>

  <style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        align-items: center;

        h2 {
            font-size: clamp(24px, 5vw, var(--fz-heading));
        }

        .archive-link {
            font-family: var(--font-mono);
            font-size: var(--fz-sm);
            &:after {
                bottom: 0.1em;
            }
        }

        .projects-grid {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 15px;
            position: relative;
            margin-top: 50px;

            @media (max-width: 1080px) {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
        }

        .more-button {
            color: var(--green);
            background-color: transparent;
            border: 1px solid var(--green);
            border-radius: var(--border-radius);
            font-size: var(--fz-xs);
            font-family: var(--font-mono);
            line-height: 1;
            text-decoration: none;
            cursor: pointer;
            transition: var(--transition);
            padding: 1.25rem 1.75rem;

            &:hover,
            &:focus,
            &:active {
                background-color: var(--green-tint);
                outline: none;
            }
            &:after {
                display: none !important;
            }
            margin: 80px auto 0;
        }
    }

    li {
        position: relative;
        cursor: default;
        transition: var(--transition);

        @media (prefers-reduced-motion: no-preference) {
            &:hover,
            &:focus-within {
                .project-inner {
                    transform: translateY(-7px);
                }
            }
        }

        a {
            position: relative;
            z-index: 1;
        }

        .project-inner {
            box-shadow: 0 10px 30px -15px var(--navy-shadow);
            transition: var(--transition);

            &:hover,
            &:focus {
                box-shadow: 0 20px 30px -15px var(--navy-shadow);
            }
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            height: 100%;
            padding: 2rem 1.75rem;
            border-radius: var(--border-radius);
            background-color: var(--light-navy);
            transition: var(--transition);
            overflow: auto;
        }

        .project-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 35px;

            .folder {
                color: var(--green);
                :global(svg) {
                    width: 40px;
                    height: 40px;
                }
            }

            .project-links {
                display: flex;
                align-items: center;
                margin-right: -10px;
                color: var(--light-slate);

                a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 5px 7px;

                    &.external {
                        :global(svg) {
                            width: 22px;
                            height: 22px;
                            margin-top: -4px;
                        }
                    }

                    :global(svg) {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }

        .project-title {
            margin: 0 0 10px;
            color: var(--lightest-slate);
            font-size: var(--fz-xxl);

            a {
            position: static;

            &:before {
                content: '';
                display: block;
                position: absolute;
                z-index: 0;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            }
        }

        .project-description {
            color: var(--light-slate);
            font-size: 17px;

            a {
                display: inline-block;
                text-decoration: none;
                text-decoration-skip-ink: auto;
                position: relative;
                transition: var(--transition);
                color: var(--green);
                &:hover,
                &:focus,
                &:active {
                    color: var(--green);
                    outline: 0;
                    &:after {
                        width: 100%;
                    }
                    & > * {
                        color: var(--green) !important;
                        transition: var(--transition);
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    width: 0;
                    height: 1px;
                    position: relative;
                    bottom: 0.37em;
                    background-color: var(--green);
                    transition: var(--transition);
                    opacity: 0.5;
                }
            }
        }

        .project-tech-list {
            display: flex;
            align-items: flex-end;
            flex-grow: 1;
            flex-wrap: wrap;
            padding: 0;
            margin: 20px 0 0 0;
            list-style: none;

            li {
            font-family: var(--font-mono);
            font-size: var(--fz-xxs);
            line-height: 1.75;

            &:not(:last-of-type) {
                margin-right: 15px;
            }
            }
        }
    }
  </style>
<script lang="ts">

    interface MediumArticle {
        author: string;
        categories: string[];
        content: string;
        description: string;
        link: string;
        pubDate: string;
        thumbnail: string;
        title: string;
        guid: string;
    }
    export let articles: MediumArticle[];
    const GRID_LIMIT = 6;
    let showMore = false;
    const firstSix = articles.slice(0, GRID_LIMIT);
    $: shownArticles = showMore ? articles : firstSix;

    function setShowMore(flag: boolean){
        showMore = flag;
    }
</script>
<section id="blogs">
    <h2>Blogs</h2>

    <a class="inline-link archive-link" href="https://totsawin-jangprasert.medium.com/" target="_blank" rel="noreferrer">
      view all
    </a>

    <ul class="articles-grid">
        {#each shownArticles as { categories, content, description, link, pubDate, title }, i}
            <li>
                <div class="article-inner">
                    <header>
                        <h3 class="article-title">
                            <a href={link} target="_blank" rel="noreferrer">
                                {title}
                            </a>
                        </h3>
                
                        <div class="article-description" >
                            { @html description.substring(0, description.indexOf('<figure>')) }
                        </div>
                    </header>
            
                    <footer>
                        <ul class="article-tech-list">
                            {#each categories as category }
                                <li>{category}</li>
                            {/each}
                        </ul>
                    </footer>
                </div>
            </li>
        {/each}
    </ul>

    <div class="buttons">
        <button class="button" on:click={() => setShowMore(!showMore)}>
            Show {showMore ? 'Less' : 'More'}
        </button>
        {#if showMore}
            <a class="button" href="https://totsawin-jangprasert.medium.com/" target="_blank" rel="noreferrer">
                All Blogs
            </a>
        {/if}
    </div>

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

        .articles-grid {
            width: 100%;
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(275px, 100%), 1fr));
            grid-gap: 15px;
            position: relative;
            margin-top: 50px;
        }

        .buttons {
            display: flex;
            flex-direction: row;
            gap: 16px;
        }

        .button {
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
                .article-inner {
                    transform: translateY(-7px);
                }
            }
        }

        a {
            position: relative;
            z-index: 1;
        }

        .article-inner {
            box-shadow: 0 10px 30px -15px var(--navy-shadow);
            transition: var(--transition);

            &:hover,
            &:focus {
                box-shadow: 0 20px 30px -15px var(--navy-shadow);
            }
            display: flex;
            justify-content: space-between;
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

        .article-title {
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

        .article-description {
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

        .article-tech-list {
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
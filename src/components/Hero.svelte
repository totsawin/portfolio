<section>
  <div style:--transition-delay="100ms"><h1>Hi, my name is</h1></div>
  <div style:--transition-delay="200ms">
    <h2 class="big-heading">Brittany Chiang.</h2>
  </div>
  <div style:--transition-delay="300ms">
    <h3 class="big-heading">I build things for the web.</h3>
  </div>
  <div style:--transition-delay="400ms">
    <p>
      I’m a software engineer specializing in building (and occasionally
      designing) exceptional digital experiences. Currently, I’m focused on
      building accessible, human-centered products at{" "}
      <a href="https://upstatement.com/" target="_blank" rel="noreferrer">
        Upstatement
      </a>
      .
    </p>
  </div>
  <div style:--transition-delay="500ms">
    <a
      class="email-link"
      href="https://www.newline.co/courses/build-a-spotify-connected-app"
      target="_blank"
      rel="noreferrer"
    >
      Check out my course!
    </a>
  </div>
</section>

<style lang="scss">
  @keyframes fade-up {
    from {
      opacity: 0.01;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    min-height: 100vh;
    padding: 0;

    @media (max-width: 480px) and (min-height: 700px) {
      padding-bottom: 10vh;
    }

    div {
      @media (prefers-reduced-motion: no-preference) {
        animation: fade-up 300ms var(--easing);
        animation-delay: calc(2000ms + var(--transition-delay));
        animation-fill-mode: backwards;
      }
    }

    h1 {
      margin: 0 0 30px 4px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
      font-weight: 400;

      @media (max-width: 480px) {
        margin: 0 0 20px 2px;
      }
    }

    h3 {
      margin-top: 10px;
      color: var(--slate);
      line-height: 0.9;
    }

    p {
      margin: 20px 0 0;
      max-width: 540px;
    }

    .email-link {
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
      margin-top: 50px;
    }
  }
</style>

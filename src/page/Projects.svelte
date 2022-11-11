<script lang="ts">

    import Project from "../components/Project.svelte";
</script>

<div id="projects">
    <div class="inner">
        <h1>My Projects</h1>
        <div class="row">
            <Project name="WhatTheGif" img="/projects/WhatTheGif.png" href="https://github.com/chammmel/whatthegif"/>
            <Project name="SmashMC" img="/projects/SmashMC.png" href="https://smashmc.eu"/>
            <Project name="review-ui" img="/projects/review-ui.png" href="https://cokejoke.github.io/review-ui/"/>
        </div>
    </div>
</div>

<style>

    .row {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, calc(33.333% - 20px));
        column-gap: 20px;
    }

    #projects {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 100vh;
    }

    .inner {
        width: 100%;
    }

    h1 {
        transition: width 0.5s;
    }

    h1:after {
        transition: width 0.5s;
        content: '';
        margin: 50px auto 100px auto;
        display: block;
        height: 5px;
        width: 80px;
        background: var(--secondary-background);
    }

    h1:hover:after {
        width: 150px;
    }

    p {
        font-size: 25px;
        font-weight: lighter;
        padding: 10px 30px;
    }

    @media all and (max-device-width: 1200px) {
        .row {
            grid-template-columns: repeat(2, calc(50% - 20px));
        }
    }

    @media all and (max-device-width: 750px) {
        h1 {
            display: none;
        }

        .row {
            grid-template-columns: auto;
        }
    }

</style>
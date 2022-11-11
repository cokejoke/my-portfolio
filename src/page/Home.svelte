<script lang="ts">
    import Typewriter from "svelte-typewriter";
    import Button from "../components/Button.svelte";
    import {Splide} from "@splidejs/svelte-splide";

    export let splide: Splide;

</script>

<div id="home">
    <div class="centered-text">
        <img src="/me.jpg" alt="Justin Mankowski Picture">
        <h1>Justin Mankowski</h1>
        <p>
            I'm a
            <span id="typewriter">
                <Typewriter loop>
                    <span>Front-End Developer</span>
                    <span>Back-End Developer</span>
                    <span>Hobby guitarist</span>
                    <span>motivated Programmer</span>
                    <span>bad singer</span>
                    <span>Member of the human species</span>
                </Typewriter>
            </span>
        </p>
        <div id="links">
            <a href="https://dribbble.com/j_mankowski" target="_blank">
                <img src="/svg/dribbble.svg" alt="Dribble">
            </a>
            <a href="https://twitter.com/CokeJokeYT" target="_blank">
                <img src="/svg/twitter.svg" alt="Twitter">
            </a>
            <a href="https://github.com/cokejoke" target="_blank">
                <img src="/svg/github.svg" alt="GitHub">
            </a>
            <a href="https://www.linkedin.com/in/justin-mankowski-76788b192" target="_blank">
                <img src="/svg/linkedin.svg" alt="LinkedIn">
            </a>
        </div>
        <Button on:click={splide.go(3)}>Contact</Button>
    </div>
</div>

<style>
    #typewriter {
        display: inline-block;
        font-size: max(1em, 15px);
    }

    #typewriter span:after {
        content: "│";
        color: var(--higlight);
    }

    .centered-text {
        text-align: center;
    }

    #home {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
    }

    #home img {
        height: 170px;
        width: 170px;
        border-radius: 50%;
    }

    #home h1 {
        font-size: 30px;
        margin-bottom: 8px;
    }

    #home p {
        font-size: max(1em, 15px);
        font-weight: bold;
        color: var(--secondary-text);
    }

    #links {
        margin: 40px 0;
        display: grid;
        grid-template-columns: auto auto auto auto;
    }

    #links a:hover img {
        transition: all 0.25s ease-in-out;
        box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.2);
    }

    #links img {
        transition: all 0.25s ease-in-out;
        height: 40px;
        width: 40px;
    }
</style>
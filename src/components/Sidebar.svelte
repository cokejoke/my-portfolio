<script lang="ts">

    import {Splide} from "@splidejs/svelte-splide";

    export let splide: Splide;
    export let index: number;

</script>

<nav>
    <h1>J<span id="hide-on-mobile">ustin</span><span id="dot">.</span></h1>
    <ul>
        <li class:active={index === 0} on:click={splide.go(0)}><span class="material-symbols-outlined">home</span><a>Home</a>
        </li>

        <li class:active={index === 1} on:click={splide.go(1)}><span class="material-symbols-outlined">person</span><a>About</a>
        </li>

        <li class:active={index === 2} on:click={splide.go(2)}><span class="material-symbols-outlined">web</span><a>Projects</a>
        </li>

        <li class:active={index === 3} on:click={splide.go(3)}><span class="material-symbols-outlined">mail</span><a>Contact</a>
        </li>
    </ul>
</nav>
<div id="spacer">
    <slot/>
</div>


<style>
    #spacer {
        margin-left: 352px;
    }

    nav {
        position: fixed;
        width: 300px;
        height: 100vh;
        padding-top: 70px;
        padding-left: 50px;
        border-right: solid 2px #333F44;
    }

    h1 {
        font-size: 40px;
        margin: 0 0 130px;
    }

    #dot {
        color: #00FFF5;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        cursor: pointer;
        display: flex;
        padding: 30px 0;
    }

    li:hover {
        color: var(--higlight);
    }

    li:hover a {
        color: var(--higlight);
    }

    .active {
        color: var(--higlight);
    }

    .active a {
        color: var(--higlight);
    }

    a {
        text-decoration: none;
        color: var(--primary-text);
        font-weight: bold;
        text-transform: uppercase;
        font-size: 22px;
        margin-left: 20px;
    }

    @media only screen and (max-width: 1400px) {
        nav {
            width: 30px;
            padding-left: 20px;
            padding-right: 20px;
        }

        ul {
            display: inline-block;
        }

        li a {
            display: none;
        }

        li span {
            font-size: 30px;
        }

        #hide-on-mobile {
            display: none;
        }

        #spacer {
            margin-left: 72px;
        }
    }
</style>
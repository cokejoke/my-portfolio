<script lang="ts">
    import Atropos from 'atropos/svelte';

    export let name: string;
    export let img: string;
    export let href: string;

</script>

<a {href} target="_blank">
    <Atropos shadow={false} highlight={false} class="my-atropos">
        <div class="project" style:background-image="url({img})">
            <div class="inner">
                <h2>{name}</h2>
            </div>
        </div>
    </Atropos>
</a>


<style>
    a {
        text-decoration: none;
        color: var(--primary-text);
        margin-bottom: 20px;
    }

    .project {
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center;
    }

    .inner {
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        width: 100%;
        background: rgba(60, 60, 60, 0.75);
        transition: opacity 0.5s;
    }

    .project:hover .inner {
        opacity: 1;
        transition: opacity 0.5s;
    }

    :global(.my-atropos) {
        height: 250px;
        width: 100%;
    }

    @media all and (max-device-width: 750px) {
        :global(.my-atropos) {
            height: calc(calc(100vh / 3) - 20px);
        }

        a {
            margin: 10px 0;
        }
    }
</style>
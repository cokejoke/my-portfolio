<script lang="ts">

    export let href: string;
    export let width: string = 'auto';

    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

</script>

<a {href} on:click={() => dispatch('click')} style="width: {width}">
    <slot/>
</a>

<style>
    a {
        cursor: pointer;
        transition: filter 0.25s ease-in-out;
        display: inline-block;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 20px;
        font-weight: bold;
        padding: 15px 60px;
        box-sizing: border-box;
        border-radius: 100px;
        color: var(--primary-text);
        background: var(--secondary-background);
    }

    a:hover {
        transition: filter 0.25s ease-in-out;
        filter: brightness(1.2);
    }
</style>
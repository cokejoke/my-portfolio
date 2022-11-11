<script lang="ts">

    export let type: string = 'text';
    export let placeholder: string = '';
    export let value: string = '';

    const handleInput = (e) => {
        value = e.target.value;
    };

</script>

<textarea {placeholder} {value} on:input={handleInput}></textarea>

<style>
    textarea {
        display: block;
        color: rgba(255, 255, 255, 0.7);
        background: var(--secondary-text);
        border: none;
        border-radius: 10px;
        max-width: 100%;
        min-width: 100%;
        min-height: 120px;
        max-height: 120px;
        box-sizing: border-box;
        padding-top: 20px;
        padding-left: 30px;
        margin-bottom: 25px;
    }

    textarea::placeholder {
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
    }
</style>
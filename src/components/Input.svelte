<script lang="ts">

    export let type: string = 'text';
    export let placeholder: string = '';
    export let value: string | number = '';

    const handleInput = (e) => {
        value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
    };

</script>

<input {type} {placeholder} {value} on:input={handleInput}>

<style>
    input {
        display: block;
        color: rgba(255, 255, 255, 0.7);
        background: var(--secondary-text);
        border: none;
        border-radius: 10px;
        width: 100%;
        height: 45px;
        box-sizing: border-box;
        padding-left: 30px;
        margin-bottom: 25px;
    }

    input::placeholder {
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
    }
</style>
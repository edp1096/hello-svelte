<svelte:options customElement="my-counter" />

<script>
    export let count = 0;

    // svelte-ignore unused-export-let
    export let numData = {};
    
    const increment = () => {
        count = parseInt(count) + 1;
    };
    const decrement = () => {
        count = parseInt(count) - 1;
    };

    // svelte-ignore unused-export-let
    export let incNum = function () {
        increment();
    };

    // svelte-ignore unused-export-let
    export let decNum = function () {
        decrement();
    };
</script>

<button on:click={increment}>
    Clicks: {count}
</button>

<style>
    button {
        font-family: inherit;
        font-size: inherit;
        padding: 1em 2em;
        color: #ff3e00;
        background-color: rgba(255, 62, 0, 0.1);
        border-radius: 2em;
        border: 2px solid rgba(255, 62, 0, 0);
        outline: none;
        width: 200px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
    }

    button:focus {
        border: 2px solid #ff3e00;
    }

    button:active {
        background-color: rgba(255, 62, 0, 0.2);
    }
</style>

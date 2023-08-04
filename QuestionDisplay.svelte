<script lang="ts">
    export let question: Question;
</script>

<p>
    {#if question}
    <b>{question[0]}</b>
    <br>
    <code>
        [{question.slice(1).join(", ")}]
    </code>
    {:else}
        Nothing matches your filters!
    {/if}
</p>

<style>
    code {
        font-size: 0.9rem;
    }
</style>
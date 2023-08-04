<script lang="ts">
	import QuestionDisplay from "QuestionDisplay.svelte";
	import { thingPicker } from "backend";

    export let questionData: QuestionData;
    let curQuestion: Question;
    let categorySelected: string;
    let filters: string = "";
    let timesClicked = 0;
    function genQuestion() {
        timesClicked += 1;
        const picked = thingPicker(questionData[categorySelected], filters.toLowerCase().split(" "))
        curQuestion = picked
    }
</script>

<div class="">
    <h2>Writing Helper</h2>
    <span>Question Type: </span>
    <select bind:value={categorySelected}>
        <option value="world">Worldbuilding</option>
        <option value="character">Character</option>
        <option value="plot">Plot</option>
        <option value="prompt">Prompt</option>
    </select>
    <br>
    <span>Filters: </span>
    <input type="text" bind:value={filters} placeholder="filters">
    <br>
    <button on:click={genQuestion}>Generate!</button>
    <p>Question:</p>
    {#if timesClicked > 0}
        <QuestionDisplay bind:question={curQuestion}></QuestionDisplay>
    {:else}
        <em>Click "Generate" to generate a question for you to answer!</em>
    {/if}
    <h2>Categories</h2>
    {#if questionData.cats != undefined}
    <details>
        <summary>Available filter categories</summary>
    {#each Object.keys(questionData.cats) as key}
        <h4>{key == "world" ? "worldbuilding" : key}</h4>
        <details>
            <summary>{key == "world" ? "worldbuilding" : key} categories</summary>
            <ul>
                {#each Object.keys(questionData.cats[key]) as title}
                    <li><b>{title}</b> - {questionData.cats[key][title]}</li>
                {/each}
            </ul>
        </details>
    {/each}
    </details>
    {/if}
</div>

<style>
</style>
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
    <div class="options">
        <span>Type:</span>
        <select bind:value={categorySelected}>
            <option value="world">Worldbuilding</option>
            <option value="character">Character</option>
            <option value="plot">Plot</option>
            <option value="prompt">Prompt</option>
            <option value="ttrpg">TTRPG</option>
        </select>
        <span>Filters:</span>
        <input type="text" bind:value={filters} placeholder="filters">
        <button on:click={genQuestion}>Generate!</button>
    </div>
    <br>
    {#if timesClicked > 0}
        <QuestionDisplay bind:question={curQuestion}></QuestionDisplay>
    {:else}
        <p><em class="unemphasize">Click "Generate" to generate a question for you to answer!</em></p>
    {/if}
    <h2>Categories</h2>
    <hr>
    {#if questionData.cats != undefined}
        {#each Object.keys(questionData.cats) as key}
            <details>
                <summary><h4 class="fixsummary">{key == "world" ? "worldbuilding" : key}</h4></summary>
                <ul>
                    {#each Object.keys(questionData.cats[key]) as title}
                        <li><b>{title}</b> - {questionData.cats[key][title]}</li>
                    {/each}
                </ul>
            </details>
        {/each}
    {/if}
    <p class="unemphasize">
        <em>Reload question data with new questions using the <code>Reload app data</code> command!</em>
    </p>
</div>

<style>
    .unemphasize {
        font-size: calc(inherit * 0.75);
        opacity: 0.7;
    }
    .options {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 0.4rem;
        text-align: right;
    }
    .options button {
        grid-column-end: span 2;
    }
    .fixsummary {
        display: inline;
    }
</style>
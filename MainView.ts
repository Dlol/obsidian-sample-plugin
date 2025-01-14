import { ItemView, WorkspaceLeaf } from "obsidian";

import Component from "./Component.svelte"

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
    component: Component;
    questionData: QuestionData;

    constructor(leaf: WorkspaceLeaf, questionData: QuestionData) {
        super(leaf);
        this.questionData = questionData
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
        return "Questions View";
    }

    async onOpen() {
        this.component = new Component({
            target: this.contentEl,
            props: {
                questionData: this.questionData,
            }
        })
    }

    async onClose() {
        this.component.$destroy();
    }
}
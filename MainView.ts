import { ItemView, WorkspaceLeaf } from "obsidian";

import Component from "./Component.svelte"

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
    component: Component;
    questionData: QuestionData;
    reloadData: Function

    constructor(leaf: WorkspaceLeaf, questionData: QuestionData) {
        super(leaf);
        this.questionData = questionData
        this.reloadData = reloadData
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
        return "Example view";
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
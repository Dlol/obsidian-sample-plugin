import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from 'MainView';
const backend = require("backend.js")

type SheetIDs = {
	[key: string]: Number
}

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	sheetsId: string;
	sheets: SheetIDs;
	questionData: QuestionData;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	sheetsId: "1hkynZs2fyTYpTCzA4fISg2vT7pwTpui7H4DDGwzFmzM",
	sheets: {
		categories: 1210882748,
		world: 0,
		character: 1931742902,
		prompt: 1378486483,
		plot: 578448559
	},
	questionData: {},
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		if (Object.isEmpty(this.settings.questionData)) {
			await this.reloadData()
		}

		this.addCommand({
			id: "reload-data",
			name: "Reload app data",
			callback: this.reloadData
		});
		
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ExampleView(leaf, this.settings.questionData)
		);

		this.activateView();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async reloadData() {
		console.log(this.settings);
		
		const csvData = await backend.updateQuestions(this.settings)
			
		const questions = backend.questionInit(csvData);
		// console.log(questions);
		this.settings.questionData = questions
		this.saveSettings()
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_EXAMPLE,
			active: true
		})

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
		)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}

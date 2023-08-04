import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from 'MainView';
const backend = require("backend.js")

type SheetIDs = {
	[key: string]: string
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
		categories: "1210882748",
		world: "0",
		character: "1931742902",
		prompt: "1378486483",
		plot: "578448559"
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
			.setName("Reload Question Data")
			.setDesc("Reloads data from Google Sheet")
			.addButton(cb => cb
				.setButtonText("Reload")
				.setIcon("refresh-cw")
				.onClick(() => {this.plugin.reloadData()}));
		
		containerEl.createEl("hr")
		containerEl.createEl("h2", {text: "Secret settings"})

		new Setting(containerEl)
			.setName('Google Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('1hkynZs2fyTYpTCzA4fISg2vT7pwTpui7H4DDGwzFmzM')
				.setValue(this.plugin.settings.sheetsId)
				.onChange(async (value) => {
					this.plugin.settings.sheetsId = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Categories Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('1210882748')
				.setValue(this.plugin.settings.sheets.categories)
				.onChange(async (value) => {
					this.plugin.settings.sheets.categories = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('World Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('0')
				.setValue(this.plugin.settings.sheets.world)
				.onChange(async (value) => {
					this.plugin.settings.sheets.world = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Character Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('1931742902')
				.setValue(this.plugin.settings.sheets.character)
				.onChange(async (value) => {
					this.plugin.settings.sheets.character = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Prompt Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('1378486483')
				.setValue(this.plugin.settings.sheets.prompt)
				.onChange(async (value) => {
					this.plugin.settings.sheets.prompt = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Plot Sheet ID')
			.setDesc('DON\'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING')
			.addText(text => text
				.setPlaceholder('578448559')
				.setValue(this.plugin.settings.sheets.plot)
				.onChange(async (value) => {
					this.plugin.settings.sheets.plot = value;
					await this.plugin.saveSettings();
				}));
	}
}

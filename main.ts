import {
	addIcon,
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	request,
	Setting,
} from "obsidian";

const EXCALIDRAW_ICON = `<g transform="translate(30,0)"><path d="M5.81,27.19a1,1,0,0,1-.71-.29A1,1,0,0,1,4.82,26l1.26-8.33a1,1,0,0,1,.28-.56L18.54,5a3.08,3.08,0,0,1,4.24,0L27,9.22a3,3,0,0,1,0,4.24L14.85,25.64a1,1,0,0,1-.56.28L6,27.18ZM8,18.34,7,25l6.66-1,12-11.94a1,1,0,0,0,.29-.71,1,1,0,0,0-.29-.7L21.36,6.39a1,1,0,0,0-1.41,0Z"/><path d="M24.9,15.17a1,1,0,0,1-.71-.29L17.12,7.81a1,1,0,1,1,1.42-1.42l7.07,7.07a1,1,0,0,1,0,1.42A1,1,0,0,1,24.9,15.17Z"/><path d="M25,30H5a1,1,0,0,1,0-2H25a1,1,0,0,1,0,2Z"/><path d="M11.46,14.83,6.38,19.77c-1.18,1.17-.74,4.25.43,5.42s4.37,1.46,5.54.29l6-6.1s-5.73,2.56-7.07,1.06S11.46,14.83,11.46,14.83Z"/></g>`;
//const pencil_icon = EXCALIDRAW_ICON
const pencil_icon = `<defs><style>.cls-1{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:4px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="VECTOR"><rect class="cls-1" x="74.98" y="21.55" width="18.9" height="37.59"/><path class="cls-1" d="M38.44,27.66a8,8,0,0,0-8.26,1.89L24.8,34.86a25.44,25.44,0,0,0-6,9.3L14.14,56.83C11.33,64.7,18.53,67.3,21,60.9" transform="translate(-1.93 -15.75)"/><polyline class="cls-1" points="74.98 25.58 56.61 18.72 46.72 15.45"/><path class="cls-1" d="M55.45,46.06,42.11,49.43,22.76,50.61c-8.27,1.3-5.51,11.67,4.88,12.8L46.5,65.78,53,68.4a23.65,23.65,0,0,0,17.9,0l6-2.46" transform="translate(-1.93 -15.75)"/><path class="cls-1" d="M37.07,64.58v5.91A3.49,3.49,0,0,1,33.65,74h0a3.49,3.49,0,0,1-3.45-3.52V64.58" transform="translate(-1.93 -15.75)"/><path class="cls-1" d="M48,66.58v5.68a3.4,3.4,0,0,1-3.34,3.46h0a3.4,3.4,0,0,1-3.34-3.45h0V65.58" transform="translate(-1.93 -15.75)"/><polyline class="cls-1" points="28.75 48.05 22.66 59.3 13.83 65.61 14.41 54.5 19.11 45.17"/><polyline class="cls-1" points="25.17 34.59 43.75 0.25 52.01 5.04 36.39 33.91"/><line class="cls-1" x1="0.25" y1="66.92" x2="13.83" y2="66.92"/></g></g>`;
const appPencile_icon = `<defs><style>.cls-1{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:4px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="VECTOR"><rect class="cls-1" x="77.39" y="35.84" width="18.9" height="37.59"/><path class="cls-1" d="M38.44,27.66a8,8,0,0,0-8.26,1.89L24.8,34.86a25.44,25.44,0,0,0-6,9.3L14.14,56.83C11.33,64.7,18.53,67.3,21,60.9" transform="translate(0.47 -1.45)"/><polyline class="cls-1" points="77.39 39.88 59.02 33.01 49.13 29.74"/><path class="cls-1" d="M55.45,46.06,42.11,49.43,22.76,50.61c-8.27,1.3-5.51,11.67,4.88,12.8L46.5,65.78,53,68.4a23.65,23.65,0,0,0,17.9,0l6-2.46" transform="translate(0.47 -1.45)"/><path class="cls-1" d="M37.07,64.58v5.91A3.49,3.49,0,0,1,33.65,74h0a3.49,3.49,0,0,1-3.45-3.52V64.58" transform="translate(0.47 -1.45)"/><path class="cls-1" d="M48,66.58v5.68a3.4,3.4,0,0,1-3.34,3.46h0a3.4,3.4,0,0,1-3.34-3.45h0V65.58" transform="translate(0.47 -1.45)"/><polyline class="cls-1" points="31.15 62.35 25.07 73.59 16.23 79.91 16.82 68.79 21.52 59.46"/><polyline class="cls-1" points="27.58 48.89 46.16 14.54 54.42 19.34 38.8 48.2"/><line class="cls-1" x1="2.66" y1="81.22" x2="16.24" y2="81.22"/></g></g><line class="cls-1" x1="25.78" y1="2" x2="39.9" y2="2"/><line class="cls-1" x1="47.36" y1="2" x2="61.47" y2="2"/><line class="cls-1" x1="3.17" y1="2" x2="17.28" y2="2"/><line class="cls-1" x1="24.62" y1="95.6" x2="38.73" y2="95.6"/><line class="cls-1" x1="46.19" y1="95.6" x2="60.31" y2="95.6"/><line class="cls-1" x1="2" y1="95.6" x2="16.11" y2="95.6"/>`;
// Remember to rename these classes and interfaces!

interface TextGeneratorSettings {
	openai_api_key: string;
	humanloop_api_key: string;
	context: string;
	showStatusBar: boolean;
}

const DEFAULT_SETTINGS: TextGeneratorSettings = {
	openai_api_key: "",
	humanloop_api_key: "",
	context: "",
	showStatusBar: true,
};

export default class TextGeneratorPlugin extends Plugin {
	settings: TextGeneratorSettings;
	statusBarItemEl: any;

	async getGeneratedText(reqParams: any) {
		let requestResults;
		try {
			requestResults = JSON.parse(await request(reqParams));
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
		console.log(requestResults);
		const text = requestResults?.logs[0].output;
		return text;
	}

	getActiveView() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView !== null) {
			return activeView;
		} else {
			new Notice("The file type should be Markdown!");
			return null;
		}
	}

	insertGeneratedText(text: string, editor: Editor) {
		let cursor = editor.getCursor();

		if (editor.listSelections().length > 0) {
			const anchor = editor.listSelections()[0].anchor;
			const head = editor.listSelections()[0].head;
			if (
				anchor.line > head.line ||
				(anchor.line === head.line && anchor.ch > head.ch)
			) {
				cursor = editor.listSelections()[0].anchor;
			}
		}
		editor.replaceRange(text, cursor);
	}

	/*
	Prepare the request parameters
	*/

	prepareParameters(
		params: TextGeneratorSettings,
		project_name: string = "Extend",
		editor: Editor
	) {
		params = {
			...params,
			context: this.getContext(editor),
		};

		let bodyParams: any = {
			project: project_name,
			max_tokens: params.max_tokens,
			inputs: { input: params.context },
			provider_api_keys: {
				OpenAI: params.openai_api_key,
			},
		};

		console.log(bodyParams);

		let reqParams = {
			url: "https://api.humanloop.com/v1/generate",
			method: "POST",
			body: JSON.stringify(bodyParams),
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": params.humanloop_api_key,
			},
		};
		return reqParams;
	}

	async generate(
		params: TextGeneratorSettings,
		project_name: string = "Extend",
		editor: Editor
	) {
		const parameters = this.prepareParameters(params, project_name, editor);
		let text;
		try {
			text = await this.getGeneratedText(parameters);
		} catch (error) {
			return Promise.reject(error);
		}

		this.insertGeneratedText(text, editor);
	}

	getContext(editor: Editor) {
		let selectedText = editor.getSelection();
		if (selectedText.length === 0) {
			const lineNumber = editor.getCursor().line;
			selectedText = editor.getLine(lineNumber);
			if (selectedText.length === 0) {
				selectedText = editor.getValue();
			}
		}
		return selectedText;
	}

	updateStatusBar(text: string) {
		let text2 = "";
		if (text.length > 0) {
			text2 = `: ${text}`;
		}

		if (this.settings.showStatusBar) {
			this.statusBarItemEl.setText(
				`Text Generator(${this.settings.max_tokens})${text2}`
			);
		}
	}

	async onload() {
		addIcon("pencil_icon", pencil_icon);
		addIcon("appPencile_icon", appPencile_icon);
		await this.loadSettings();
		this.statusBarItemEl = this.addStatusBarItem();
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"pencil_icon",
			"Generate Text!",
			async (evt: MouseEvent) => {
				// Called when the user clicks the icon.
				const activeFile = this.app.workspace.getActiveFile();
				this.updateStatusBar(`processing... `);
				const activeView = this.getActiveView();
				if (activeView !== null) {
					const editor = activeView.editor;
					try {
						await this.generate(this.settings, "Extend", editor);
						this.updateStatusBar(``);
					} catch (error) {
						new Notice(
							"Text Generator Plugin: Error check console CTRL+SHIFT+I"
						);
						this.updateStatusBar(`Error: Check Console`);
						setTimeout(() => this.updateStatusBar(``), 3000);
					}
				}
			}
		);

		this.addCommand({
			id: "extend-text",
			name: "keep writing",
			icon: "pencil_icon",
			hotkeys: [{ modifiers: ["Ctrl"], key: "j" }],
			editorCallback: async (editor: Editor) => {
				this.updateStatusBar(`processing... `);
				try {
					await this.generate(this.settings, "Extend", editor);
					this.updateStatusBar(``);
				} catch (error) {
					new Notice(
						"Text Generator Plugin: Error check console CTRL+SHIFT+I"
					);
					this.updateStatusBar(`Error check console`);
					setTimeout(() => this.updateStatusBar(``), 3000);
				}
			},
		});

		this.addCommand({
			id: "summarise",
			name: "tl:dr",
			icon: "appPencile_icon",
			hotkeys: [{ modifiers: ["Ctrl"], key: "t" }],
			editorCallback: async (editor: Editor) => {
				this.updateStatusBar(`processing... `);
				try {
					await this.generate(this.settings, "summarise", editor);
					this.updateStatusBar(``);
				} catch (error) {
					new Notice(
						"Text Generator Plugin: Error check console CTRL+SHIFT+I"
					);
					this.updateStatusBar(`Error check console`);
					setTimeout(() => this.updateStatusBar(``), 3000);
				}
			},
		});

		this.addCommand({
			id: "critique",
			name: "critique",
			icon: "appPencile_icon",
			hotkeys: [{ modifiers: ["Ctrl"], key: "q" }],
			editorCallback: async (editor: Editor) => {
				this.updateStatusBar(`processing... `);
				try {
					await this.generate(this.settings, "critique", editor);
					this.updateStatusBar(``);
				} catch (error) {
					new Notice(
						"Text Generator Plugin: Error check console CTRL+SHIFT+I"
					);
					this.updateStatusBar(`Error check console`);
					setTimeout(() => this.updateStatusBar(``), 3000);
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TextGeneratorSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TextGeneratorSettingTab extends PluginSettingTab {
	plugin: TextGeneratorPlugin;

	constructor(app: App, plugin: TextGeneratorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for OpenAI",
		});

		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("Set your OpenAI API Key. Go to https://beta.openai.com/")
			.addText((text) =>
				text
					.setPlaceholder("Enter your api_key")
					.setValue(this.plugin.settings.openai_api_key)
					.onChange(async (value) => {
						this.plugin.settings.openai_api_key = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Humanloop API Key")
			.setDesc(
				"Set your Humanloop API Key. Go to https://app.humanloop.com/settings to get it."
			)
			.addText((text) =>
				text
					.setPlaceholder("Set your humanlo api_key")
					.setValue(this.plugin.settings.humanloop_api_key)
					.onChange(async (value) => {
						this.plugin.settings.humanloop_api_key = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("showStatusBar")
			.setDesc("Show information in the Status Bar")
			.addToggle((v) =>
				v
					.setValue(this.plugin.settings.showStatusBar)
					.onChange(async (value) => {
						this.plugin.settings.showStatusBar = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

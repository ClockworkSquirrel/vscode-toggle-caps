// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, Range } from 'vscode';

const toggleCapitalisation = () => {
	const editor = window.activeTextEditor,
		document = editor?.document;

	const selections: { range: Range, replace?: string }[] = [];
	for (const selection of editor?.selections ?? []) {
		selections.push({
			range: new Range(
				selection.start.line,
				selection.start.character,
				selection.end.line,
				selection.end.character
			)
		});
	}

	for (let selection of selections) {
		const selectedText = document?.getText(selection.range) ?? "";
		let newText = selectedText;

		if (selectedText.toUpperCase() === selectedText) {
			newText = selectedText.toLowerCase();
		} else if (selectedText.toLowerCase() === selectedText) {
			newText = selectedText.replace(/\w+/g, word => `${word[0].toUpperCase()}${word.substr(1).toLowerCase()}`);
		} else {
			newText = selectedText.toUpperCase();
		}

		selection.replace = newText;
	}

	editor?.edit(edit => {
		for (const selection of selections) {
			if (selection.replace) {
				edit.replace(selection.range, selection.replace);
			}
		}
	});
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('editor.toggleCaps', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		toggleCapitalisation();
	});

	context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() { };

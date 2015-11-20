// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process'
import * as fs from 'fs'

/*var scriptcs: child_process.ChildProcess = child_process.spawn("/Users/filip/.svm/shims/scriptcs");
var outputChannel = vscode.window.createOutputChannel("scriptcs");

scriptcs.stdout.on('data', function(buffer) {
				console.log(buffer.toString());
				outputChannel.appendLine(buffer.toString());
});*/

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ScriptCsRepl" is now active!');

	var disposable = vscode.commands.registerCommand('extension.scriptcsRepl', () => {
		let parser = new ScriptParser(vscode.window.activeTextEditor);
		let text = parser.getScriptText();

		console.log(text);

		let runner = new ScriptRunner();
		let scriptPath = runner.saveScript(text);

		let scriptcs = child_process.spawn("/Users/filip/.svm/shims/scriptcs", ['-script', scriptPath]);
		var outputChannel = vscode.window.createOutputChannel('scriptcs');
		outputChannel.show();
		
		scriptcs.stdout.on('data', function(buffer) {
			console.log(buffer.toString());
			outputChannel.appendLine(buffer.toString());
		});
	});
}

class ScriptParser {
	private _textEditor: vscode.TextEditor;

	constructor(texteditor: vscode.TextEditor) {
		this._textEditor = texteditor;
	}

	public getScriptText(): string {
		let start = this._textEditor.selection.start;
		let end = this._textEditor.selection.end;
		let text = this._textEditor.document.getText(new vscode.Range(start, end));

		return text;
	}
}

class ScriptRunner {
	public saveScript(text: string): string {
		let name = (Math.random() + 1).toString(36).substring(7) + '.csx';
		let folder = vscode.window.activeTextEditor.document.fileName.replace('test.csx', '') + ".script_temp/";
		let path = folder + name;

		try {
			fs.mkdirSync(folder);
		} catch (e) {
			if (e.code != 'EEXIST') throw e;
		}

		fs.writeFileSync(path, text);

		return path;
	}
}
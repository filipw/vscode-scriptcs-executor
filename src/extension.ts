import * as vscode from 'vscode';
import * as child_process from 'child_process'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {
  console.log('scriptcsRunner is now active!');

  var disposable = vscode.commands.registerCommand('extension.scriptcsRunner', () => {
    let parser = new ScriptParser(vscode.window.activeTextEditor);
    let text = parser.getScriptText();
    let config = vscode.workspace.getConfiguration('scriptcsRunner');
    let runner = new ScriptRunner(config.get<string>('scriptcsPath'), config.get<boolean>('debug'));
    let scriptPath = text == undefined ? vscode.window.activeTextEditor.document.fileName : runner.saveScript(text);
    runner.runScript(scriptPath);
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

    if (start.compareTo(end) == 0) {
      return undefined;
    }

    let text = this._textEditor.document.getText(new vscode.Range(start, end));

    return text;
  }
}

class ScriptRunner {
  private _folder: string;
  private _scriptcsPath: string;
  private _debug: boolean;

  constructor(scriptcsPath : string, debug : boolean) {
    let currentLocation = vscode.window.activeTextEditor.document.fileName.substring(0, vscode.window.activeTextEditor.document.fileName.lastIndexOf('/'));
    this._folder = currentLocation + '/.script_temp/';
    this._scriptcsPath = scriptcsPath;
    this._debug = debug;
  }

  public saveScript(text: string): string {
    let name = (Math.random() + 1).toString(36).substring(5) + '.csx';
    let path = this._folder + name;

    try {
      fs.mkdirSync(this._folder);
    } catch (e) {
      if (e.code != 'EEXIST') throw e;
    }
    fs.writeFileSync(path, text);

    return path;
  }

  public runScript(path: string): void {
    let args = ['-script', path];
    if (this._debug) {
      args.push('-debug');
    }
    let scriptcs = child_process.spawn(this._scriptcsPath, args);

    var outputChannel = vscode.window.createOutputChannel('scriptcs');
    outputChannel.show();

    scriptcs.stdout.on('data', buffer => {
      console.log(buffer.toString());
      outputChannel.appendLine(buffer.toString());
    });

    scriptcs.on('close', () => {
      try {
        fs.readdirSync(this._folder).forEach(fileName => {
          fs.unlinkSync(this._folder + '/' + fileName);
        });
        fs.rmdirSync(this._folder);
      } catch (e) {
        if (e.code != 'ENOENT') throw e;
      }
    });
  }
}
# C# script executor (scriptcs for Visual Studio Code)

VS Code extension for running C# snippets using scriptcs.

## Pre-requisities

[scriptcs](http://www.scriptcs.net) should be installed on your machine.

## Usage

### Snippet

1. Highlight a snippet of C# code
2. Press `CMD+shift+r` (Mac) or `Ctrl+shift+r` (Linux, Windows) to run the code. Alternatively, press `F1` and choose `Execute with scriptcs` option
3. A new `scriptcs` window will pop up, with your script output.

![](http://g.recordit.co/Ul43RuQVnL.gif)


### Whole file/script

1. Just set focus to a window with C# code. Do not highlight anything.
2. Press `CMD+shift+r` (Mac) or `Ctrl+shift+r` (Linux, Windows) to run the code. Alternatively, press `F1` and choose `Execute with scriptcs` option
3. A new `scriptcs` window will pop up, with your script output.

## Building

Clone the repo and open in VS Code, then just press F5 to run. This will launch a new instance of VS Code with the extension installed.

Alternatively, you can build from command line. Navigate to the folder with the extension and run:

```
node ./node_modules/vscode/bin/compile -watch -p ./

```


## Contributing and issues

All the code is on [github](https://github.com/filipw/vscode-scriptcs-runner). Please report any issues or suggestions there.

## License

[MIT](https://github.com/filipw/vscode-scriptcs-runner/blob/master/LICENSE)

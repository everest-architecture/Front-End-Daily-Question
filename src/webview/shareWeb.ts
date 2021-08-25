import * as vscode from "vscode";
import * as path from "path";

export function webViewPanel(context: vscode.ExtensionContext, code: string) {
	// 1. 使用 createWebviewPanel 创建一个 panel，然后给 panel 放入 html 即可展示 web view
	const panel = vscode.window.createWebviewPanel(
		"shareWeb",
		"shareCode",
		vscode.ViewColumn.One, // web view 显示位置
		{
			enableScripts: true, // 允许 JavaScript
			retainContextWhenHidden: true, // 在 hidden 的时候保持不关闭
		}
	);

	const template = {
		background: "#101213",
		width: "auto",
		height: "auto",
		borderRadius: "5px",
	};

	// 获取npm包
	const onDiskPath = vscode.Uri.file(
		path.join(context.extensionPath, "media", "phl.js")
	);
	const URI = onDiskPath.with({ scheme: "vscode-resource" });

	panel.webview.html = getWebviewContent(code, JSON.stringify(template), URI);
}

function getWebviewContent(
	code: string,
	template: string,
	scriptUri: vscode.Uri
) {
	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
			<div id="back" style="background-color: #cfd2d1; height: 100vh; width: 100vw; padding: 56px;">
				<canvas id="canvas" style="box-shadow: 0px 6px 10px 4px #333; border-radius: 8px;"></canvas>
			</div>		
				<script src="${scriptUri}"></script>
				<script type="module">
				(function() {
					const canvas = document.getElementById('canvas');
					const ctx = canvas.getContext('2d');
									
					phl(canvas, ctx, ${template}, \`${code}\`, "js");		

					setTimeout(() => {
						let imgURL = canvas.toDataURL(canvas);

						const a = document.createElement('a')
						a.href = imgURL
						a.setAttribute('download', 'shareImg')
						a.click()
						document.body.removeChild(a);
					}, 1000);
				}())
				</script>
		</body>
		</html>`;
}

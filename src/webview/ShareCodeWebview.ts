import * as vscode from "vscode";
import * as path from "path";

export function webViewPanel(context: vscode.ExtensionContext, code: string) {
	// 1. 使用 createWebviewPanel 创建一个 panel，然后给 panel 放入 html 即可展示 web view
	const panel = vscode.window.createWebviewPanel(
		"shareWeb",
		"分享题目",
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
		path.join(context.extensionPath, "media", "index.js")
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
			<title>shareCode</title>
			<style>
				input {
					outline-style: none ;
					border: 1px solid #ccc; 
					border-radius: 8px;
					padding: 13px 14px;
					width: 150px;
					font-size: 14px;
					font-weight: 700;
				} 
				.inputBox {
					margin: 0 0 20px 0;
					color: black;
					font-size: 20px;
				}
				#btn, #download {
					width: 80px; 
					height: 40px; 
					margin: 0 5px;
					border-width: 0px; 
					border-radius: 3px; 
					background: #1E90FF; 
					cursor: pointer; 
					outline: none; 
					color: white; 
					font-size: 16px;
				}
			</style>
		</head>
		<body>
			<div id="back" style="background-color: #cfd2d1; height: 100vh; width: 100vw; padding: 36px 56px 56px 56px;">
			<div class="inputBox">
				<input id="codeWidth" placeholder="宽度，默认auto" > px
				<button id="btn">生成</button>
				<button id="download">下载</button>
			</div>
				<canvas id="canvas" style="box-shadow: 0px 6px 10px 4px #333; border-radius: 8px;"></canvas>		
			</div>		
				<script src="${scriptUri}"></script>
				<script type="module">
				(function() {
					const canvas = document.getElementById('canvas');
					const ctx = canvas.getContext('2d');
					const inputWidth = document.getElementById('codeWidth');
					const btn = document.getElementById('btn');
					const download = document.getElementById('download');
					let code = \`${code}\`;
									
					phl(canvas, ctx, ${template}, code, "js");		

					
					console.log(code);
					btn.onclick =  function() {
						if (inputWidth.value) {
							const template = {
								background: "#101213",
								width: inputWidth.value + 'px',
								height: "auto",
								borderRadius: "5px",
							};
							phl(canvas, ctx, template, code, "js");		
						}
					}

					download.onclick =  function() {
						let imgURL = canvas.toDataURL(canvas);

						const a = document.createElement('a')
						a.href = imgURL
						a.setAttribute('download', 'shareImg')
						a.click()
						document.body.removeChild(a);
					}

				}())
				</script>
		</body>
		</html>`;
}

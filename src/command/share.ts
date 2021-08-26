import * as vscode from "vscode";
import { webViewPanel } from "../webview/ShareCodeWebview";

// 获取页面中代码的方法
const processContent = (input: string, START = 0, END = 1000) => {
	const NEW_LINE = "\n";

	return new Promise<string>((resolve, reject) => {
		// Reject immediately when nonsensical input
		if (START > END) {
			return reject();
		}

		let r = input
			.split(NEW_LINE)
			.filter((line, index) => {
				const CURRENT_LINE = index + 1;
				return CURRENT_LINE >= START && CURRENT_LINE <= END;
			})
			.join(NEW_LINE);

		let start = r.indexOf("*[interview]: start");
		let end = r.indexOf("*[interview]: end");
		let title = r.slice(0, r.indexOf("\n", r.indexOf("\n") + 1));
		title = "  " + title;

		r = title.concat(r.slice(start + 19, end));

		// Otherwise resolve with the correct section
		resolve(r);
	});
};

export async function share(
	content: string,
	context: vscode.ExtensionContext
): Promise<void> {
	try {
		// vscode.window.showInformationMessage("正在生成图片，请稍等...");

		const processedContent = await processContent(content);

		webViewPanel(context, processedContent);

		vscode.window.showInformationMessage("生成成功！");
	} catch (error) {
		console.log("err", error);
		vscode.window.showInformationMessage("生成失败！");
	}
}

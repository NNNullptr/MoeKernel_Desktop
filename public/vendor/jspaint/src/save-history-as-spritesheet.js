// @ts-check
/* global localize, main_canvas, systemHooks, file_name, system_file_handle, undos, current_history_node */

// This script exports the document history as a spritesheet,
// in guaranteed quality, and supporting transparency,
// as compared with the poor color quality of the GIF export.
// In the future, exporting as APNG might be supported as an official feature,
// which would also allow high quality and transparency in history exports.

// USAGE: paste this code into the browser console

// HACK: Using unnecessary-looking "../src" so that TypeScript can follow the path, but in the browser,
// when pasting this script into the console, it will be relative to the current page's URL, and the ".." will be ignored,
// as there's nothing higher up than "/", assuming the app is hosted at the root of the domain.
// TypeScript still doesn't like the top-level await because there are no exports, but
// exports are not valid in the JS console. So, ignore the errors.
// @ts-ignore
const { write_image_file } = await import("../src/functions.js");
// @ts-ignore
const { make_canvas } = await import("../src/helpers.js");


const width = main_canvas.width;
const height = main_canvas.height;
const frame_history_nodes = [...undos, current_history_node];
const sheet_canvas = make_canvas(width * frame_history_nodes.length, height);
let x = 0;
for (const frame_history_node of frame_history_nodes) {
	sheet_canvas.ctx.clearRect(x, 0, width, height);
	sheet_canvas.ctx.putImageData(frame_history_node.image_data, x, 0);
	x += width;
	if (frame_history_node.selection_image_data) {
		const selection_canvas = make_canvas(frame_history_node.selection_image_data);
		sheet_canvas.ctx.drawImage(selection_canvas, x + frame_history_node.selection_x, frame_history_node.selection_y);
	}
}
write_image_file(sheet_canvas, "image/png", (blob) => {
	const suggested_file_name = `${file_name.replace(/\.(bmp|dib|a?png|gif|jpe?g|jpe|jfif|tiff?|webp|raw)$/i, "")} history animation sheet.png`;
	systemHooks.showSaveFileDialog({
		dialogTitle: localize("Save As"), // localize("Save Animation As"),
		getBlob: () => blob,
		defaultFileName: suggested_file_name,
		defaultPath: typeof system_file_handle === "string" ? `${system_file_handle.replace(/[/\\][^/\\]*/, "")}/${suggested_file_name}` : null,
		defaultFileFormatID: "image/png",
		formats: [{
			formatID: "image/png",
			mimeType: "image/png",
			name: localize("PNG (*.png)").replace(/\s+\([^(]+$/, ""),
			nameWithExtensions: localize("PNG (*.png)"),
			extensions: ["png"],
		}],
	});
});


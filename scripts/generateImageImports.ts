import fs from "fs";
import path from "path";

const IMAGES_DIR = "./data";
const OUTPUT_FILE = "./src/utils/imageImports.ts";

const files = fs
	.readdirSync(IMAGES_DIR)
	.filter((file) => /\.(jpg|jpeg|png|webp)$/.test(file));

const imports = files
	.map((file) => {
		const fr24Id = path.basename(file, path.extname(file));
		return `import image${fr24Id} from "../../data/${file}";`;
	})
	.join("\n");

const content = `// This file is auto-generated. Do not edit.
${imports}

export const images: Record<string, string> = {
${files
	.map((file) => {
		const fr24Id = path.basename(file, path.extname(file));
		return `    "${fr24Id}": image${fr24Id},`;
	})
	.join("\n")}
};`;

fs.writeFileSync(OUTPUT_FILE, content);

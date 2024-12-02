import { renderToString } from "react-dom/server";
import { launch } from "puppeteer";
import Template, { type TemplateData } from "./template/template";
import { readFileSync } from "node:fs"
class Invoice {
    pdf: Uint8Array<ArrayBufferLike> | undefined;
    async make(data: TemplateData) {
        const browser = await launch();
        const page = await browser.newPage();
        await page.setContent(renderToString(Template(data)));
        await page.addStyleTag({ content: readFileSync(`${import.meta.dirname}/template/style.css`).toString("utf-8") })
        const pdf = await page.pdf({ format: "A4" });
        page.close();
        browser.close();
        return pdf;
    }
}

export { Invoice };
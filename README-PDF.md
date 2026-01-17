# Generating the Resume PDF

This guide explains how to generate a PDF version of the resume with the same layout and formatting as the website.

## Method 1: Using Node.js (Recommended - Best Quality)

### Prerequisites

1. **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)

### Installation

1. Install the required dependencies:
```bash
npm install
```

This will install Puppeteer, which is used to generate the PDF from the HTML.

### Generating the PDF

Run the following command:
```bash
npm run generate-resume
```

Or directly:
```bash
node generate-resume-pdf.js
```

The script will:
1. Load `resume-print.html`
2. Apply the styles from `resume-print.css`
3. Generate `resume.pdf` with proper scaling and formatting

## Method 2: Using Browser Print (Quick Alternative)

If you don't have Node.js installed, you can use your browser's print-to-PDF feature:

1. Open `resume-print.html` in your web browser
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac) to open the print dialog
3. Select "Save as PDF" as the destination
4. In print settings:
   - Set margins to "Minimum" or "None"
   - Enable "Background graphics"
   - Set paper size to "Letter" (8.5" x 11")
5. Click "Save" to generate the PDF

**Note:** Browser-generated PDFs may have slight differences in font rendering and spacing compared to the Puppeteer method.

## File Structure

- `resume-print.html` - Standalone HTML version of the resume, optimized for PDF
- `resume-print.css` - Print-optimized stylesheet with proper scaling
- `generate-resume-pdf.js` - Node.js script using Puppeteer to generate the PDF
- `resume.pdf` - Generated PDF output (created after running the script)

## Customization

To update the resume content:
1. Edit `resume-print.html` with your changes
2. Run `npm run generate-resume` to regenerate the PDF

The PDF will maintain the same visual layout, fonts, and styling as the website version, properly scaled for standard letter size (8.5" x 11").

## Troubleshooting

- **Font issues**: Make sure Font Awesome CDN is accessible when generating the PDF
- **Image not showing**: Ensure the logo image path is correct relative to `resume-print.html`
- **Layout issues**: Check that all CSS is properly loaded in the HTML file

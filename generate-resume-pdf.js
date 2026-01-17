// generate-resume-pdf.js
// Script to generate PDF from resume-print.html using Puppeteer
// Run with: node generate-resume-pdf.js

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation...');
    
    // Get the absolute path to the resume HTML file
    const htmlPath = path.join(__dirname, 'resume-print.html');
    const outputPath = path.join(__dirname, 'resume.pdf');
    
    // Check if HTML file exists
    if (!fs.existsSync(htmlPath)) {
        console.error('Error: resume-print.html not found!');
        process.exit(1);
    }
    
    // Convert to file:// URL for local file access
    const fileUrl = `file://${htmlPath}`;
    
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport to standard letter size
        await page.setViewport({
            width: 816,  // 8.5 inches at 96 DPI
            height: 1056, // 11 inches at 96 DPI
            deviceScaleFactor: 2 // Higher quality
        });
        
        console.log('Loading HTML file...');
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for fonts to load
        await page.evaluateHandle(() => document.fonts.ready);
        
        console.log('Generating PDF...');
        await page.pdf({
            path: outputPath,
            format: 'Letter',
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            printBackground: true,
            preferCSSPageSize: false,
            scale: 1.0
        });
        
        await browser.close();
        
        console.log(`✅ PDF generated successfully: ${outputPath}`);
        console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
}

// Run the generator
generatePDF();

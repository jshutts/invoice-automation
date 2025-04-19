# invoice-automation
# AI Voice Invoice Generator

A simple web application that allows users to describe completed work (through text or voice) and automatically generates a PDF invoice using AI.

## Features

- Text input for work description
- Basic "AI" processing to extract invoice details
- Invoice form with editable fields
- PDF invoice generation
- *Coming soon:* Voice input capabilities

## Getting Started

### Running Locally

1. Clone this repository
2. Open `index.html` in your browser

### Deploying to GitHub Pages

1. Fork this repository
2. Go to repository Settings
3. Navigate to "Pages" section
4. Select "main" branch as the source
5. Click "Save"
6. Your site will be published at `https://[your-username].github.io/ai-invoice-generator/`

## Project Structure

- `index.html`: Main application page
- `script.js`: JavaScript logic for the application
- Future additions:
  - Speech recognition integration
  - More advanced AI processing
  - User authentication
  - Invoice history

## How It Works

1. Enter a description of the work completed in the text area
2. Click "Process Description" to extract invoice details using basic NLP
3. Edit the generated invoice details as needed
4. Click "Generate PDF Invoice" to create and download a PDF invoice

## Technologies Used

- HTML, CSS, JavaScript
- Bootstrap 5 for UI
- jsPDF for PDF generation
- *Future:* Web Speech API for voice recognition

## Next Steps

- Add voice input functionality
- Integrate with a more sophisticated NLP model or API
- Add user accounts and invoice history
- Create more invoice templates
- Add custom branding options

## License

MIT

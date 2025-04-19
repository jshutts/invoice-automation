# AI Voice Invoice Generator

A web application that allows users to describe completed work through text or voice input and automatically generates a PDF invoice using AI processing.

## Features

- Text input for work description
- Voice input using Web Speech API
- Enhanced AI processing to extract invoice details including:
  - Client name detection
  - Hours and rate extraction
  - Service type categorization
  - Multiple deliverable identification
- Editable invoice form with line items
- PDF invoice generation with professional formatting

## Getting Started

### Running Locally

1. Clone this repository
2. Make sure all files are in the same directory:
   - `index.html`
   - `script.js`
   - `voice-input.js`
   - `ai-processor.js`
3. Open `index.html` in your browser (Chrome recommended for best voice recognition)
4. Allow microphone access when prompted

### Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to repository Settings
4. Navigate to "Pages" section
5. Select "main" branch as the source
6. Click "Save"
7. Your site will be published at `https://[your-username].github.io/ai-invoice-generator/`

### Testing the Application

1. Use these sample phrases to test the AI processing:
   - "I completed a website redesign for client XYZ Corp, including 5 new pages and logo design. It took 12 hours at $75/hour."
   - "Wrote 3 blog articles for Acme Inc. about their new product launch. Total fixed price: $600."
   - "Consulting for Global Systems on their marketing strategy. 6 hours of meetings plus 2 presentations."

## Project Structure

- `index.html`: Main application page with UI elements
- `script.js`: Core JavaScript logic for invoice generation
- `voice-input.js`: Speech recognition functionality
- `ai-processor.js`: Enhanced text processing for invoice data extraction

## Implementation Details

### Voice Recognition
The application uses the Web Speech API, which is available in most modern browsers. The voice input:
- Works best in Chrome, Edge, and Safari
- Provides real-time transcription
- Can be cleared or appended to existing text

### AI Processing
The text processing:
- Extracts client names using multiple pattern matching strategies
- Identifies hours worked and hourly rates
- Categorizes the type of service based on keyword frequency
- Recognizes fixed price arrangements
- Identifies multiple deliverables as separate line items

### Invoice Generation
The PDF invoice:
- Creates professional-looking invoices with proper formatting
- Includes all identified line items
- Calculates subtotals, taxes, and totals
- Supports notes and payment terms

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

### Enhancements
- Connect to a proper NLP/AI API for more accurate extraction
- Add user accounts and invoice history storage
- Create multiple invoice templates
- Add custom branding options
- Implement invoice numbering system

### Advanced Features
- Email invoice sending capabilities
- Payment integration (Stripe, PayPal)
- Client database management
- Recurring invoice scheduling
- Tax calculation based on location
- Multi-language support

### Technical Improvements
- Convert to a proper React or Vue.js application
- Add backend API with Node.js/Express
- Implement secure storage with MongoDB or Firebase
- Add comprehensive error handling
- Improve accessibility features

## License

MIT

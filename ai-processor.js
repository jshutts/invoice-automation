// Enhanced AI text processing for invoice generation
// This is a more sophisticated local implementation 
// In production, you might want to use an actual NLP API

// Common services and their regular expressions
const serviceTypes = [
    {
        type: 'Web Development',
        keywords: ['website', 'web development', 'webpage', 'landing page', 'site', 'web design']
    },
    {
        type: 'Graphic Design',
        keywords: ['logo', 'design', 'graphic', 'banner', 'brochure', 'poster', 'flyer']
    },
    {
        type: 'Content Writing',
        keywords: ['article', 'content', 'blog', 'write', 'writing', 'copywriting', 'copy']
    },
    {
        type: 'Consulting',
        keywords: ['consult', 'consulting', 'advice', 'strategy', 'session', 'meeting']
    },
    {
        type: 'Marketing',
        keywords: ['marketing', 'campaign', 'social media', 'seo', 'ppc', 'advertising']
    },
    {
        type: 'Development',
        keywords: ['programming', 'coding', 'software', 'app', 'application', 'development']
    }
];

// Enhanced data extraction function
function enhancedExtractInvoiceData(text) {
    const data = {
        clientName: '',
        lineItems: [],
        notes: ''
    };
    
    // Normalize text (lowercase, replace multiple spaces with single space)
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
    
    // Extract client name
    const clientPatterns = [
        /(?:client|for)\s+([A-Za-z0-9\s&.,]+?)(?:,|\.|$)/i,
        /([A-Za-z0-9\s&.,]+?)(?:'s project|'s website|'s work)/i,
        /completed\s+.*?\s+for\s+([A-Za-z0-9\s&.,]+)(?:,|\.|$)/i
    ];
    
    for (const pattern of clientPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            data.clientName = match[1].trim();
            break;
        }
    }
    
    // Extract hours and rates
    const hourPatterns = [
        /(\d+(?:\.\d+)?)\s*hours?/i,
        /(\d+(?:\.\d+)?)\s*hrs?/i,
        /time spent:?\s*(\d+(?:\.\d+)?)/i,
        /spent\s*(\d+(?:\.\d+)?)\s*hours?/i
    ];
    
    const ratePatterns = [
        /\$([\d.]+)(?:\s*\/\s*hour|\/hr|per hour)/i,
        /rate:?\s*\$([\d.]+)/i,
        /hourly rate:?\s*\$([\d.]+)/i,
        /(\d+(?:\.\d+)?)\s*dollars? (?:per|an|\/) hour/i
    ];
    
    let hours = 0;
    let rate = 0;
    
    // Find hours
    for (const pattern of hourPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            hours = parseFloat(match[1]);
            break;
        }
    }
    
    // Find rate
    for (const pattern of ratePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            rate = parseFloat(match[1]);
            break;
        }
    }
    
    // Detect service type based on keywords
    let detectedService = 'Professional Services'; // Default
    let highestMatchCount = 0;
    
    for (const service of serviceTypes) {
        let matchCount = 0;
        for (const keyword of service.keywords) {
            if (normalizedText.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        }
        
        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            detectedService = service.type;
        }
    }
    
    // Extract fixed price if mentioned
    const fixedPricePattern = /(?:fixed price|flat fee|total cost|project cost|total price):?\s*\$([\d,]+(?:\.\d+)?)/i;
    const fixedPriceMatch = text.match(fixedPricePattern);
    
    if (fixedPriceMatch && fixedPriceMatch[1]) {
        const fixedPrice = parseFloat(fixedPriceMatch[1].replace(/,/g, ''));
        
        data.lineItems.push({
            description: detectedService + ' (Fixed Price)',
            quantity: 1,
            unitPrice: fixedPrice,
            amount: fixedPrice
        });
    } 
    // Extract deliverables and create separate line items
    else {
        // If we have hours and rate
        if (hours > 0 && rate > 0) {
            data.lineItems.push({
                description: detectedService,
                quantity: hours,
                unitPrice: rate,
                amount: hours * rate
            });
        } 
        // If we only have hours but no rate
        else if (hours > 0) {
            data.lineItems.push({
                description: detectedService,
                quantity: hours,
                unitPrice: 0, // User will need to fill this in
                amount: 0
            });
        }
        // If we have neither hours nor rate
        else {
            data.lineItems.push({
                description: detectedService,
                quantity: 1,
                unitPrice: 0, // User will need to fill this in
                amount: 0
            });
        }
        
        // Look for additional deliverables
        const deliverablePatterns = [
            /(\d+)\s+(pages?|logos?|banners?|articles?|posts?|designs?|revisions?|edits?)/gi,
            /created\s+(\d+)\s+(pages?|logos?|banners?|articles?|posts?|designs?)/gi,
            /delivered\s+(\d+)\s+(pages?|logos?|banners?|articles?|posts?|designs?)/gi
        ];
        
        for (const pattern of deliverablePatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const quantity = parseInt(match[1]);
                const item = match[2].endsWith('s') ? match[2] : match[2] + 's'; // Ensure plural
                
                data.lineItems.push({
                    description: `${item.charAt(0).toUpperCase() + item.slice(1)}`,
                    quantity: quantity,
                    unitPrice: 0, // User will need to fill this in
                    amount: 0
                });
            }
        }
    }
    
    // If no line items were added, add a default one
    if (data.lineItems.length === 0) {
        data.lineItems.push({
            description: 'Professional Services',
            quantity: 1,
            unitPrice: 0,
            amount: 0
        });
    }
    
    // Extract potential due date information
    const dueDatePatterns = [
        /due\s+(?:on|by)?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
        /due\s+(?:on|by)?\s*(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{2,4})/i
    ];
    
    let dueDate = '';
    for (const pattern of dueDatePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            dueDate = match[1];
            break;
        }
    }
    
    if (dueDate) {
        data.dueDate = dueDate;
    }
    
    // Save original text as notes
    data.notes = "Based on work description: " + text;
    
    return data;
}

// Replace the simple extractInvoiceData function with the enhanced one
document.addEventListener('DOMContentLoaded', function() {
    // Check if the original extractInvoiceData function exists
    if (typeof window.extractInvoiceData !== 'undefined') {
        // Override it with our enhanced version
        window.extractInvoiceData = enhancedExtractInvoiceData;
        console.log('AI processing enhanced successfully');
    } else {
        console.error('Original extractInvoiceData function not found. Make sure to include this script after script.js');
    }
});

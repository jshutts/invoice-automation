// Voice-to-text functionality using Web Speech API
let recognition;
let isRecording = false;
let transcriptFinal = '';

// Initialize speech recognition
function initSpeechRecognition() {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
        return false;
    }
    
    // Create speech recognition instance
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    // Configure speech recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Handle results
    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                transcriptFinal += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update the text area with the transcript
        const textArea = document.getElementById('workDescription');
        textArea.value = transcriptFinal + interimTranscript;
    };
    
    // Handle errors
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        stopRecording();
    };
    
    // Handle when speech recognition stops
    recognition.onend = function() {
        if (isRecording) {
            // Restart if it was still supposed to be recording
            recognition.start();
        } else {
            updateMicButton(false);
        }
    };
    
    return true;
}

// Start recording
function startRecording() {
    if (!recognition) {
        if (!initSpeechRecognition()) {
            return;
        }
    }
    
    try {
        recognition.start();
        isRecording = true;
        updateMicButton(true);
    } catch (error) {
        console.error('Error starting speech recognition:', error);
    }
}

// Stop recording
function stopRecording() {
    if (recognition) {
        recognition.stop();
        isRecording = false;
        updateMicButton(false);
    }
}

// Toggle recording state
function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        // Clear previous transcript if starting fresh
        if (document.getElementById('clearOnRecord').checked) {
            transcriptFinal = '';
            document.getElementById('workDescription').value = '';
        }
        startRecording();
    }
}

// Update microphone button appearance
function updateMicButton(isRecording) {
    const micButton = document.getElementById('micButton');
    
    if (isRecording) {
        micButton.classList.add('btn-danger');
        micButton.classList.remove('btn-outline-primary');
        micButton.innerHTML = '<i class="fas fa-microphone"></i> Stop Recording';
    } else {
        micButton.classList.remove('btn-danger');
        micButton.classList.add('btn-outline-primary');
        micButton.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
    }
}

// Initialize when the document loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if speech recognition is supported
    const supported = initSpeechRecognition();
    
    if (supported) {
        // Add the mic button to the UI
        const descriptionContainer = document.querySelector('.mb-3');
        
        // Create and append the microphone button
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'mt-2';
        buttonGroup.innerHTML = `
            <button type="button" id="micButton" class="btn btn-outline-primary">
                <i class="fas fa-microphone"></i> Start Recording
            </button>
            <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="clearOnRecord" checked>
                <label class="form-check-label" for="clearOnRecord">
                    Clear text when starting new recording
                </label>
            </div>
        `;
        
        descriptionContainer.appendChild(buttonGroup);
        
        // Add event listener to the mic button
        document.getElementById('micButton').addEventListener('click', toggleRecording);
    }
});

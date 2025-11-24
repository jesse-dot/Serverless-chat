# Serverless Chat

A lightweight, serverless chat application that runs entirely in your browser using local storage for data persistence. No backend required!

## Features

- 💬 **Multiple Conversations**: Create and manage multiple chat conversations
- 💾 **Local Storage**: All data is stored locally in your browser
- 🎨 **Modern UI**: Clean, responsive interface with gradient design
- ⚡ **Fast & Lightweight**: No server calls, instant response
- 🔒 **Privacy First**: Your data never leaves your browser
- 📱 **Responsive**: Works on desktop and mobile devices

## How It Works

This is a fully client-side application that demonstrates:
- Local browser storage (localStorage API) for data persistence
- Conversation management (create, switch, delete)
- Message history with timestamps
- Editable conversation titles
- Auto-scrolling message view

## Usage

Simply open `index.html` in your web browser. No installation or server setup required!

### Features:

1. **New Conversation**: Click the "+" button to start a new conversation
2. **Send Messages**: Type your message and click "Send" or press Enter
3. **Switch Conversations**: Click on any conversation in the sidebar
4. **Edit Title**: Click the edit icon (✎) next to the conversation title
5. **Delete Conversation**: Click the trash icon (🗑) to delete the current conversation
6. **Clear All**: Delete all conversations at once

## Technical Details

- **Pure Vanilla JavaScript**: No frameworks or dependencies
- **localStorage API**: For persistent data storage
- **Responsive CSS**: Mobile-friendly design
- **Modern ES6+**: Uses modern JavaScript features

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `app.js` - Application logic and local storage management

## Browser Compatibility

Works with all modern browsers that support localStorage:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Demo Note

The current implementation includes a simple echo response to demonstrate the message flow. In a real application, you would integrate with an AI API or chat service of your choice.

## License

MIT
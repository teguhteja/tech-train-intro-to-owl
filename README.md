# Technical Training - Introduction to OWL

This project is a technical training platform designed to introduce OWL (Odoo Web Library). This web application presents tutorial content in Markdown format, equipped with a video player, and page navigation to facilitate the learning process.

## Key Features

*   **Dynamic Content**: Loads and displays tutorial content from Markdown files.
*   **Integrated Video Player**: Embeds and displays tutorial videos (e.g., from Google Drive) to complement the text material.
*   **Page Navigation**: "Previous" and "Next" buttons to move between tutorial sections sequentially.
*   **Theme Toggler**: Feature to switch between light mode and dark mode for reading comfort.
*   **Dynamic Titles**: Page title and main heading are dynamically updated according to the currently displayed tutorial content.

## Project Structure

```
tech-train-intro-to-owl/
├── index.html          # Main HTML file, application skeleton
├── style.css           # CSS file for styling
├── script.js           # JavaScript file for application logic (loading content, navigation, theme)
├── tutorials/          # (Recommended) Directory for storing Markdown tutorial files
│   ├── tutorial1.md
│   └── tutorial2.md
└── README.md           # This file
```

## How to Use

1.  **Clone Repository (If on Git)**:
    ```bash
    git clone <your-repository-url>
    cd tech-train-intro-to-owl
    ```
2.  **Open `index.html`**:
    Open the `index.html` file directly in your preferred web browser (e.g., Google Chrome, Firefox).

3.  **Tutorial Configuration**:
    *   The logic for loading Markdown files and setting up navigation is likely in `script.js`. You may need to edit an array or configuration object within that file to define the order and paths of your Markdown tutorial files.
    *   Ensure your Markdown files are placed in the correct location (e.g., in a `tutorials/` directory) and their paths match those configured in `script.js`.

## Technologies Used

*   **HTML5**: For the basic structure of the web page.
*   **CSS3**: For styling and visual appearance.
*   **JavaScript (ES6+)**: For dynamic functionality, user interaction, and application logic.
*   **Marked.js**: JavaScript library for parsing and rendering Markdown text into HTML.

## Contributing

If you wish to contribute to this project, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

## Development Roadmap (Optional)

*   [ ] Implement tutorial content search.
*   [ ] Add learning progress indicator.
*   [ ] Integrate interactive OWL code examples directly on the page.
*   [ ] Accessibility improvements.

---

*This README was generated based on an analysis of the `index.html` file and common functionalities in similar projects. Please adjust the details to more accurately reflect your specific implementation in `script.js` and your file structure.*

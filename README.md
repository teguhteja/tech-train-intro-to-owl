# Interactive OWL Odoo 17 Tutorial

This project is an interactive web platform designed to present a series of tutorials on OWL (Odoo Web Library) for Odoo 17. Tutorial content is dynamically loaded from Markdown files and can include supporting videos. The platform also features easy navigation, a sidebar for the tutorial list, and light/dark theme support.

## Key Features

-   **Dynamic Content**: Tutorials are loaded from a CSV file (`pages.csv`) that defines each page, including title, Markdown file, video link, and navigation.
-   **Navigation Sidebar**: A sidebar displays a list of all available tutorials, making it easy for users to switch between topics.
-   **Integrated Video Player**: Can display embedded tutorial videos (e.g., from Google Drive).
-   **Markdown Rendering**: Tutorial content is written in Markdown format and rendered into HTML using `marked.js`.
-   **Page Navigation**: "Previous" and "Next" links for sequential navigation between tutorials.
-   **Light/Dark Theme**: Users can switch between light and dark modes, and theme preference is saved in `localStorage`.
-   **Basic Responsive Design**: A basic layout that accommodates the sidebar and main content area.

## Project Structure

```
tech-train-intro-to-owl/
├── index.html          # Main HTML page structure
├── style.css           # CSS file for styling, including themes and sidebar layout
├── script.js           # JavaScript logic for dynamic functionality
├── pages.csv           # Configuration file for the list of tutorials and their content
└── content/              # Recommended directory for storing Markdown files
    ├── tutorial1.md
    └── tutorial2.md
    └── ...
```

## How It Works

1.  **Initialization**:
    *   When the page loads (`DOMContentLoaded`), `script.js` fetches and parses the `pages.csv` file.
    *   The `pages.csv` file contains information for each tutorial page, such as `id`, `page_title`, `h1_content`, `markdown_file`, `iframe_src`, `prev_id`, `next_id`, `prev_text`, and `next_text`.

2.  **Page Determination**:
    *   The script checks for a `page` parameter in the URL (e.g., `index.html?page=intro-owl`).
    *   If no parameter is present, the first page from `pages.csv` is loaded by default.

3.  **Content Loading**:
    *   Based on the active page `id`, `script.js` will:
        *   Update the page title (`<title>`) and main heading (`<h1>`).
        *   Show or hide the video container and set the iframe `src` if a video link exists.
        *   Load and render the corresponding Markdown file into the `<main id="markdown-content">` element using `marked.js`.

4.  **Sidebar**:
    *   The `populateSidebar` function fills the tutorial list (`<ul id="tutorial-list">`) in the sidebar.
    *   Each item is a link to the corresponding tutorial page.
    *   The currently active tutorial is marked with an `.active` class.

5.  **Navigation**:
    *   "Previous" and "Next" links are updated based on the `prev_id`, `next_id`, `prev_text`, and `next_text` data from `pages.csv` for the currently active page.

6.  **Theme Management**:
    *   Users can click the "Dark Mode"/"Light Mode" button to switch themes.
    *   A `dark-mode` class is added or removed from the `<body>` element.
    *   Theme preference is stored in `localStorage` and applied on subsequent visits.
    *   The theme can also follow operating system preferences if no theme is manually saved.

## `pages.csv` Setup

The `pages.csv` file is central to the tutorial content. Each row (after the header) represents one tutorial page. Here is an example of the column structure:

```csv
id,page_title,h1_content,markdown_file,iframe_src,prev_id,prev_text,next_id,next_text
intro-owl,Introduction to OWL,OWL Basics,content/01-intro-owl.md,https://link-to-video-1/preview, , ,component-basic,Next: Basic Components &raquo;
component-basic,OWL Basic Components,Creating Basic Components,content/02-component-basic.md,https://link-to-video-2/preview,intro-owl,&laquo; Previous: Introduction,state-props,Next: State & Props &raquo;
...
```

*   **`id`**: Unique identifier for the page (used in the URL).
*   **`page_title`**: Text for the browser's `<title>` tag.
*   **`h1_content`**: Text for the main `<h1>` heading on the page.
*   **`markdown_file`**: Relative path to the `.md` file containing the tutorial content.
*   **`iframe_src`**: URL for the video iframe `src` (leave empty if no video).
*   **`prev_id`**: `id` of the previous tutorial page (leave empty if this is the first page).
*   **`prev_text`**: Text for the "Previous" link (can contain HTML like `&laquo;`).
*   **`next_id`**: `id` of the next tutorial page (leave empty if this is the last page).
*   **`next_text`**: Text for the "Next" link (can contain HTML like `&raquo;`).

## Dependencies

-   **Marked.js**: Used to render Markdown content. Loaded via CDN in `index.html`.
    ```html
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    ```

## How to Run Locally

1.  Ensure all files (`index.html`, `style.css`, `script.js`, `pages.csv`) are in the same directory.
2.  Create a `content/` directory (or as per the path you use in `pages.csv`) and place your tutorial Markdown files inside it.
3.  Open the `index.html` file in your browser.
    *   Since this project uses `fetch()` to load `pages.csv` and Markdown files, you might need to run a simple local web server to avoid CORS issues if opening directly from the file system (`file:///...`). Many browser extensions or simple commands (like `python -m http.server` or `npx serve`) can be used for this.

## Contributing

Suggestions and contributions for improvements are always welcome. Feel free to create an *issue* or *pull request*.

---

*This README was generated based on the existing project structure and functionality.*
```
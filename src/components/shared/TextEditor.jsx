import React from "react";
import ReactEditor from "react-text-editor-kit";

/**
 * Reusable TextEditor Component
 * @param {string} value - The HTML content
 * @param {Function} setValue - Function to update the HTML content
 * @param {Array} toolbar - Toolbar buttons
 * @param {Array} navbar - Navbar items
 * @param {Array} removeFromToolbar - Items to remove from toolbar
 * @param {Array} removeFromNavbar - Items to remove from navbar
 * @param {Object} themeConfig - Theme customization
 */
const TextEditor = ({
  value,
  setValue,
  toolbar = [
    "undo",
    "redo",
    "|",
    "format",
    "fontfamily",
    "fontsize",
    "|",
    "bold",
    "italic",
    "underline",
    "superscript",
    "subscript",
    "|",
    "alignment",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "alignJustify",
    "|",
    "indent",
    "outdent",
    "|",
    "orderedList",
    "unorderedList",
    "|",
    "textColor",
    "|",
    "image",
    "link",
    "|",
    "copy",
    "cut",
    "paste",
    "|",
    "source_code",
    "full_screen",
    "special_character",
    "horizontal_line",
  ],
  navbar = [],
  removeFromToolbar = [],
  removeFromNavbar = [],
  themeConfig = {
    "background-color": "#121212",
    "border-color": "#ccc",
    "text-color": "#fff",
    "save-button-background": "#4CAF50",
    "toolbar-text-color": "gray",
  },
}) => {
  return (
    <div className="editor-wrapper">
      <ReactEditor
        value={value}
        onChange={setValue}
        toolbar={toolbar}
        navbar={navbar}
        remove_from_toolbar={removeFromToolbar}
        remove_from_navbar={removeFromNavbar}
        theme_config={themeConfig}
        use_shadow_dom={true}
        className="editor-wrapper"
        // className="prose prose-invert max-w-none"
        placeholder="Write your content here..."
      />
    </div>
  );
};

export default TextEditor;

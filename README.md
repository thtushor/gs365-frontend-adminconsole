# React

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Image Upload Test Page

### Route

- `/test/image-upload`

### Description

A test page for uploading single or multiple images using the API endpoints defined in `src/api/ApiList.js`.

### Features

- Upload a single image using the `IMAGE_UPLOAD_URL` endpoint.
- Upload multiple images using the `MULTIPLE_IMAGE_UPLOAD_URL` endpoint.
- Displays the server response for each upload.

### API Endpoints

- **Single Image Upload:**
  - URL: `IMAGE_UPLOAD_URL` (`http://localhost:8000/upload`)
  - Method: `POST`
  - Form field: `file`
- **Multiple Images Upload:**
  - URL: `MULTIPLE_IMAGE_UPLOAD_URL` (`http://localhost:8000/uploads`)
  - Method: `POST`
  - Form field: `files` (multiple files)

### Example Response

```
{
  "success": true,
  "message": "Image(s) uploaded successfully",
  "data": {
    // ...additional data from server
  }
}
```

### How to Use

1. Navigate to `/test/image-upload` in your browser.
2. Use the form to select a file (or files) and upload.
3. View the server response below the form.

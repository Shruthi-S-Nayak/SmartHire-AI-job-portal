/**
 * Opens a resume PDF in the browser.
 * Uses Google Docs Viewer as fallback for Cloudinary raw PDFs
 * which may not open directly in all browsers.
 */
export const openResume = (resumeUrl) => {
  if (!resumeUrl) return;

  // For Cloudinary raw URLs, use Google Docs viewer to ensure it opens in browser
  if (resumeUrl.includes("cloudinary.com") && resumeUrl.includes("/raw/")) {
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=false`;
    window.open(googleViewerUrl, "_blank", "noopener,noreferrer");
  } else {
    // For regular URLs or already-fixed URLs, open directly
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  }
};

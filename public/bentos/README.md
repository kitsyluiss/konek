# Bento Templates

This folder contains JSON templates for bentos.

## Files

- `default.json` - The default template loaded on first launch

## JSON Structure

```json
{
  "id": "unique-id",
  "name": "Bento Name",
  "version": "1.0",
  "profile": {
    "name": "Display Name",
    "bio": "Bio text",
    "avatarUrl": "",
    "theme": "light",
    "primaryColor": "blue",
    "showBranding": true,
    "socialAccounts": []
  },
  "blocks": [
    {
      "id": "block_id",
      "type": "LINK|TEXT|IMAGE|SOCIAL|SOCIAL_ICON|MAP|SPACER",
      "title": "Block Title",
      "content": "URL or content",
      "colSpan": 3,
      "rowSpan": 3,
      "gridColumn": 1,
      "gridRow": 1,
      "color": "bg-gray-900",
      "textColor": "text-white"
    }
  ]
}
```

## Grid System

The grid is 9x9. Regular blocks use 3x3 cells. Social icons use 1x1.

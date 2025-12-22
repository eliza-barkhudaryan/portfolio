# Eliza Barkhudaryan — Portfolio

A newspaper-style portfolio website showcasing music, photography, and writing.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Content

### Music

1. Add your audio file (MP3) to `public/data/music/`
2. Edit `public/data/music/objects.json`:

```json
{
  "name": "Song Title",
  "description": "Description of the piece...",
  "path": "your-song-file.mp3"
}
```

### Photography

1. Add your images (JPG/PNG) to `public/data/photography/`
2. Edit `public/data/photography/objects.json`:

```json
{
  "name": "Photo Series Title",
  "description": "Description of the series...",
  "photo_objects": [
    {
      "name": "Individual Photo Title",
      "description": "Description of this specific photo...",
      "path": "image1.jpg"
    },
    {
      "name": "Another Photo Title",
      "description": "Description of this photo...",
      "path": "image2.jpg"
    }
  ]
}
```

### Writing

Edit `public/data/writing/objects.json`:

```json
{
  "name": "Article Title",
  "description": "Description of the piece...",
  "url": "https://link-to-your-article.com",
  "linkLabel": "Read Article"
}
```

## Deploy to GitHub Pages

1. Build the project: `npm run build`
2. The `dist` folder contains the deployable files
3. Push to GitHub and enable Pages from the `dist` folder or use GitHub Actions

## Structure

```
portfolio/
├── public/
│   └── data/
│       ├── music/
│       │   └── objects.json      # Music entries
│       ├── photography/
│       │   └── objects.json      # Photography entries
│       └── writing/
│           └── objects.json      # Writing entries
├── src/
│   ├── components/
│   │   ├── Button.ts
│   │   ├── WorkCard.ts
│   │   ├── SongPlayer.ts
│   │   ├── PhotoSlider.ts
│   │   └── LinkPlaceholder.ts
│   ├── pages/
│   │   ├── Music.ts
│   │   ├── Photography.ts
│   │   ├── Writing.ts
│   │   └── Contacts.ts
│   ├── types.ts
│   ├── main.ts
│   └── style.css
└── index.html
```


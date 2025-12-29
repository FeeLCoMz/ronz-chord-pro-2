import React, { useState } from 'react';

const SongImporter = ({ onImport, onCancel }) => {
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [mode, setMode] = useState('url'); // 'url' or 'paste'

  // Parse chord and lyrics from raw text
  const parseRawText = (text) => {
    const lines = text.split('\n');
    let title = '';
    let artist = '';
    let chordProLines = [];
    let inLyrics = false;

    // Try to extract title and artist from first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (!title && line.length > 0 && line.length < 100) {
        title = line;
      } else if (!artist && title && line.length > 0 && line.length < 100) {
        artist = line;
        break;
      }
    }

    // Process lines to detect chords and lyrics
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines at the beginning
      if (!inLyrics && !line) continue;
      
      // Detect chord lines (lines with chord patterns)
      const chordPattern = /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?[0-9]?(\s+[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?[0-9]?)*$/;
      
      if (chordPattern.test(line)) {
        // This is a chord line
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        if (nextLine) {
          // Combine chord and lyric line
          const chords = line.split(/\s+/);
          const words = nextLine.split(' ');
          let combined = '';
          
          for (let j = 0; j < Math.max(chords.length, words.length); j++) {
            if (j < chords.length && chords[j]) {
              combined += `[${chords[j]}]`;
            }
            if (j < words.length && words[j]) {
              combined += words[j] + ' ';
            }
          }
          chordProLines.push(combined.trim());
          i++; // Skip next line as we've processed it
        } else {
          chordProLines.push(line);
        }
        inLyrics = true;
      } else if (line) {
        // Regular lyric line
        chordProLines.push(line);
        inLyrics = true;
      } else if (inLyrics) {
        // Empty line within lyrics
        chordProLines.push('');
      }
    }

    return {
      title: title || 'Untitled',
      artist: artist || 'Unknown',
      lyrics: chordProLines.join('\n')
    };
  };

  // Fetch and extract from URL
  const handleFetchUrl = async () => {
    if (!url.trim()) {
      setError('Masukkan URL terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Since we can't directly fetch due to CORS, we'll use a CORS proxy
      // Note: In production, you should use your own proxy server
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari URL');
      }

      const html = await response.text();
      
      // Basic HTML parsing - try to extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Remove script and style tags
      const scripts = tempDiv.querySelectorAll('script, style');
      scripts.forEach(script => script.remove());
      
      const text = tempDiv.textContent || tempDiv.innerText;
      const parsed = parseRawText(text);
      
      setExtractedData(parsed);
      setRawText(text);
    } catch (err) {
      setError('Gagal mengambil data: ' + err.message + '. Coba gunakan mode "Paste Text".');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse pasted text
  const handleParse = () => {
    if (!rawText.trim()) {
      setError('Masukkan teks chord dan lirik terlebih dahulu');
      return;
    }

    try {
      const parsed = parseRawText(rawText);
      setExtractedData(parsed);
      setError('');
    } catch (err) {
      setError('Gagal memproses teks: ' + err.message);
    }
  };

  // Save imported song
  const handleSave = () => {
    if (!extractedData) return;

    const newSong = {
      id: Date.now(),
      title: extractedData.title,
      artist: extractedData.artist,
      youtubeId: '',
      lyrics: `{title: ${extractedData.title}}
{artist: ${extractedData.artist}}

${extractedData.lyrics}`,
      createdAt: new Date().toISOString()
    };

    onImport(newSong);
  };

  // Update extracted data
  const handleExtractedChange = (field, value) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh' }}>
        <div className="modal-header">
          <h2>🌐 Import Chord & Lirik</h2>
          <button onClick={onCancel} className="btn-close">✕</button>
        </div>

        <div className="modal-body" style={{ overflow: 'auto' }}>
          {/* Mode Selector */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setMode('url')}
              className={`btn ${mode === 'url' ? 'btn-primary' : ''}`}
            >
              📎 Dari URL
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`btn ${mode === 'paste' ? 'btn-primary' : ''}`}
            >
              📋 Paste Text
            </button>
          </div>

          {/* URL Mode */}
          {mode === 'url' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">URL Situs Chord/Lirik</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/song-chords"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border)' }}
                />
                <button
                  onClick={handleFetchUrl}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? '⏳ Loading...' : '🔍 Ambil'}
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                ⚠️ Beberapa situs mungkin tidak support karena CORS policy. Gunakan mode "Paste Text" jika gagal.
              </p>
            </div>
          )}

          {/* Paste Mode */}
          {mode === 'paste' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Paste Chord & Lirik</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Copy dan paste chord & lirik dari situs lain di sini...&#10;&#10;Contoh:&#10;Am        F&#10;Kau begitu sempurna&#10;       C           G&#10;Di mataku kau begitu indah"
                rows={12}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '2px solid var(--border)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.9rem',
                  background: 'var(--bg)',
                  color: 'var(--text)'
                }}
              />
              <button
                onClick={handleParse}
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                🔄 Parse & Extract
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{ 
              padding: '1rem', 
              background: '#fee', 
              color: '#c33', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData && (
            <div style={{ 
              background: 'var(--bg)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '2px solid var(--border)' 
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>✅ Data Terekstrak</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Judul</label>
                <input
                  type="text"
                  value={extractedData.title}
                  onChange={(e) => handleExtractedChange('title', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    border: '2px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--text)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Artis</label>
                <input
                  type="text"
                  value={extractedData.artist}
                  onChange={(e) => handleExtractedChange('artist', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    border: '2px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--text)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Lirik & Chord</label>
                <textarea
                  value={extractedData.lyrics}
                  onChange={(e) => handleExtractedChange('lyrics', e.target.value)}
                  rows={10}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    border: '2px solid var(--border)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9rem',
                    background: 'var(--card)',
                    color: 'var(--text)'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn">
            Batal
          </button>
          <button 
            onClick={handleSave} 
            disabled={!extractedData}
            className="btn btn-primary"
          >
            💾 Simpan Lagu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongImporter;

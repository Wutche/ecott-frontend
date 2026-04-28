'use client';

import React, { useState } from 'react';
import styles from './UploadArea.module.css';

export interface AnalysisRequestData {
  fileCount: number;
  pair: string;
  sessionLabel: string;
}

interface UploadAreaProps {
  onAnalyze: (data: AnalysisRequestData) => void;
}

export default function UploadArea({ onAnalyze }: UploadAreaProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [pair, setPair] = useState('EUR/USD');
  const [sessionLabel, setSessionLabel] = useState('Weekly Setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    // Simulate AI loading
    setTimeout(() => {
      onAnalyze({ fileCount: files.length, pair, sessionLabel });
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>New COT Analysis</h2>
        <p>Upload 1 to 6 CFTC Commitments of Traders (COT) report screenshots.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <label>Currency Pair</label>
          <input 
            type="text" 
            value={pair} 
            onChange={e => setPair(e.target.value)} 
            placeholder="e.g. EUR/USD" 
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Session Label (Optional)</label>
          <input 
            type="text" 
            value={sessionLabel} 
            onChange={e => setSessionLabel(e.target.value)} 
            placeholder="e.g. Q3 Opening" 
            className={styles.input}
          />
        </div>
      </div>

      <div 
        className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.icon}>📄</span>
          <h3>Drag & Drop screenshots here</h3>
          <p>or click to browse from your computer</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className={styles.fileInput} 
            onChange={(e) => {
              if (e.target.files) {
                setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
              }
            }} 
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <h4>Attached Files ({files.length}/6)</h4>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} 
                <button onClick={() => setFiles(files.filter((_, i) => i !== idx))}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className="btn-primary" 
          disabled={files.length === 0 || isAnalyzing}
          onClick={handleAnalyzeClick}
        >
          {isAnalyzing ? 'Analyzing AI Pattern...' : 'Run Analysis'}
        </button>
      </div>
    </div>
  );
}

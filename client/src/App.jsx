import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import './styles/App.css';

/**
 * UploadArea Component
 * Área de drag & drop para upload de imagens
 */
function UploadArea({ onFilesSelected, selectedFiles, onRemoveFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length > 0) {
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    const handleFileInput = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    return (
        <div className="upload-section">
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Upload className="upload-icon" size={48} />
                <h3>Arraste suas imagens aqui</h3>
                <p>ou clique para selecionar arquivos</p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="file-input"
                />
                <div className="supported-formats">
                    <span>Suporta: JPEG, PNG, WebP, AVIF</span>
                    <span>Máximo: 10MB por arquivo</span>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h3>Imagens selecionadas ({selectedFiles.length})</h3>
                    <div className="files-grid">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="file-preview">
                                <img src={file.preview} alt={file.name} />
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveFile(index)}
                                    aria-label="Remover imagem"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * PresetSelector Component
 * Seletor de presets de redes sociais
 */
function PresetSelector({ presets, selectedPreset, onPresetChange }) {
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    // Agrupar presets por plataforma
    const platforms = [...new Set(Object.values(presets).map(p => p.platform))];

    const filteredPresets = selectedPlatform === 'all'
        ? presets
        : Object.fromEntries(
            Object.entries(presets).filter(([, preset]) => preset.platform === selectedPlatform)
        );

    return (
        <div className="preset-selector">
            <h3>Escolha o formato</h3>

            <div className="platform-filters">
                <button
                    className={`filter-btn ${selectedPlatform === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedPlatform('all')}
                >
                    Todas
                </button>
                {platforms.map(platform => (
                    <button
                        key={platform}
                        className={`filter-btn ${selectedPlatform === platform ? 'active' : ''}`}
                        onClick={() => setSelectedPlatform(platform)}
                    >
                        {platform}
                    </button>
                ))}
            </div>

            <div className="presets-grid">
                {Object.entries(filteredPresets).map(([key, preset]) => (
                    <button
                        key={key}
                        className={`preset-card ${selectedPreset === key ? 'selected' : ''}`}
                        onClick={() => onPresetChange(key)}
                    >
                        <div className="preset-icon">
                            <ImageIcon size={24} />
                        </div>
                        <div className="preset-info">
                            <h4>{preset.name}</h4>
                            <p>{preset.width} × {preset.height}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

/**
 * ProcessingOptions Component
 * Opções de qualidade, formato e ajuste
 */
function ProcessingOptions({ format, quality, fit, background, onFormatChange, onQualityChange, onFitChange, onBackgroundChange }) {
    return (
        <div className="processing-options">
            <h3>Configurações de exportação</h3>

            <div className="options-grid">
                <div className="option-group">
                    <label htmlFor="fit">Modo de ajuste</label>
                    <select
                        id="fit"
                        value={fit}
                        onChange={(e) => onFitChange(e.target.value)}
                    >
                        <option value="contain">Ajustar (sem cortar)</option>
                        <option value="cover">Preencher (com corte)</option>
                        <option value="fill">Esticar para preencher</option>
                        <option value="inside">Reduzir se necessário</option>
                    </select>
                    <p className="option-description">
                        {fit === 'contain' && '✅ Imagem completa, com bordas se necessário'}
                        {fit === 'cover' && '✂️ Corta a imagem para preencher todo espaço'}
                        {fit === 'fill' && '📐 Distorce a imagem para o tamanho exato'}
                        {fit === 'inside' && '↕️ Apenas reduz se maior que o alvo'}
                    </p>
                </div>

                {fit === 'contain' && (
                    <div className="option-group">
                        <label htmlFor="background">Cor de fundo (bordas)</label>
                        <div className="color-picker-wrapper">
                            <input
                                id="background"
                                type="color"
                                value={background}
                                onChange={(e) => onBackgroundChange(e.target.value)}
                                className="color-picker"
                            />
                            <input
                                type="text"
                                value={background}
                                onChange={(e) => onBackgroundChange(e.target.value)}
                                className="color-input"
                                placeholder="#ffffff"
                            />
                        </div>
                        <p className="option-description">
                            📦 Cor usada nas bordas quando a imagem não preencher todo o espaço
                        </p>
                    </div>
                )}

                <div className="option-group">
                    <label htmlFor="format">Formato de saída</label>
                    <select
                        id="format"
                        value={format}
                        onChange={(e) => onFormatChange(e.target.value)}
                    >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                        <option value="avif">AVIF</option>
                    </select>
                </div>

                <div className="option-group">
                    <label htmlFor="quality">
                        Qualidade: {quality}%
                    </label>
                    <input
                        id="quality"
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => onQualityChange(parseInt(e.target.value))}
                        className="quality-slider"
                    />
                    <div className="slider-labels">
                        <span>Baixa</span>
                        <span>Média</span>
                        <span>Alta</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * App Component
 * Componente principal da aplicação
 */
function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [presets, setPresets] = useState({});
    const [selectedPreset, setSelectedPreset] = useState('');
    const [format, setFormat] = useState('jpeg');
    const [quality, setQuality] = useState(85);
    const [fit, setFit] = useState('contain');
    const [background, setBackground] = useState('#ffffff');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // API Base URL
    const API_URL = import.meta.env.VITE_API_URL || '';

    // Carregar presets ao montar o componente
    React.useEffect(() => {
        fetch(`${API_URL}/api/presets`)
            .then(res => res.json())
            .then(data => {
                setPresets(data.presets);
                // Selecionar primeiro preset por padrão
                const firstPreset = Object.keys(data.presets)[0];
                setSelectedPreset(firstPreset);
            })
            .catch(err => console.error('Erro ao carregar presets:', err));
    }, []);

    const handleFilesSelected = useCallback((files) => {
        const filesWithPreview = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            preview: URL.createObjectURL(file)
        }));

        setSelectedFiles(prev => [...prev, ...filesWithPreview]);
    }, []);

    const handleRemoveFile = useCallback((index) => {
        setSelectedFiles(prev => {
            // Limpar URL de preview
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const handleUploadAndProcess = async () => {
        if (selectedFiles.length === 0) {
            alert('Selecione ao menos uma imagem');
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Enviando imagens...');

        try {
            // 1. Upload das imagens
            const formData = new FormData();
            selectedFiles.forEach(({ file }) => {
                formData.append('images', file);
            });

            const uploadResponse = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error(uploadData.error || 'Erro no upload');
            }

            setUploadedFiles(uploadData.files);
            setLoadingMessage('Processando imagens...');

            // 2. Processar as imagens
            const processResponse = await fetch(`${API_URL}/api/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: uploadData.files.map(f => f.id),
                    preset: selectedPreset,
                    format,
                    quality,
                    fit,
                    background
                })
            });

            if (!processResponse.ok) {
                throw new Error('Erro ao processar imagens');
            }

            // 3. Download do resultado
            const blob = await processResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Nome do arquivo baseado no preset
            const presetName = presets[selectedPreset]?.name || 'imagens';
            const fileName = selectedFiles.length === 1
                ? `${presetName.replace(/\s+/g, '_')}.${format}`
                : `${presetName.replace(/\s+/g, '_')}_lote.zip`;

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Limpar arquivos selecionados após sucesso
            selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
            setSelectedFiles([]);
            setLoadingMessage('');

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar imagens: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <h1>Editor de Imagens para Redes Sociais</h1>
                    <p className="subtitle">
                        Otimize suas imagens com presets profissionais para Instagram, YouTube, Facebook, Twitter e LinkedIn
                    </p>
                </div>
            </header>

            <main className="container">
                <div className="main-grid">
                    <div className="left-panel">
                        <UploadArea
                            onFilesSelected={handleFilesSelected}
                            selectedFiles={selectedFiles}
                            onRemoveFile={handleRemoveFile}
                        />

                        {selectedFiles.length > 0 && Object.keys(presets).length > 0 && (
                            <>
                                <PresetSelector
                                    presets={presets}
                                    selectedPreset={selectedPreset}
                                    onPresetChange={setSelectedPreset}
                                />

                                <ProcessingOptions
                                    format={format}
                                    quality={quality}
                                    fit={fit}
                                    background={background}
                                    onFormatChange={setFormat}
                                    onQualityChange={setQuality}
                                    onFitChange={setFit}
                                    onBackgroundChange={setBackground}
                                />

                                <button
                                    className="btn btn-primary process-btn"
                                    onClick={handleUploadAndProcess}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner"></div>
                                            {loadingMessage}
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Processar e Baixar
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="right-panel">
                        <div className="info-card card">
                            <h3>Como funciona?</h3>
                            <ol className="steps-list">
                                <li>
                                    <strong>1. Faça upload</strong>
                                    <p>Selecione uma ou várias imagens</p>
                                </li>
                                <li>
                                    <strong>2. Escolha o formato</strong>
                                    <p>Selecione um preset de rede social</p>
                                </li>
                                <li>
                                    <strong>3. Configure</strong>
                                    <p>Ajuste qualidade e formato de saída</p>
                                </li>
                                <li>
                                    <strong>4. Baixe</strong>
                                    <p>Receba suas imagens otimizadas</p>
                                </li>
                            </ol>
                        </div>

                        <div className="features-card card">
                            <h3>Recursos</h3>
                            <ul className="features-list">
                                <li>✨ Processamento em lote</li>
                                <li>🎯 Presets para todas as redes sociais</li>
                                <li>🖼️ Suporta JPEG, PNG, WebP e AVIF</li>
                                <li>⚡ Processamento rápido com Sharp</li>
                                <li>📦 Download em ZIP para múltiplas imagens</li>
                                <li>🎨 Controle total de qualidade</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>Editor de Imagens © 2026 - Otimizado para criadores de conteúdo</p>
                </div>
            </footer>
        </div>
    );
}

export default App;

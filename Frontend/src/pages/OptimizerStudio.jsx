import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Zap, Smartphone, Image as ImageIcon, Sparkles, SlidersHorizontal, Info, ArrowRight, Download } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const OptimizerStudio = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState('auto');
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const { backendUrl } = React.useContext(AppContext);

  const modes = [
    { id: 'auto', name: 'Auto Optimize', icon: <Zap className="w-5 h-5" />, desc: 'Smart compression based on size' },
    { id: 'instagram', name: 'Instagram', icon: <ImageIcon className="w-5 h-5" />, desc: '1080x1080 perfectly cropped' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <Smartphone className="w-5 h-5" />, desc: 'High-compression for sharing' },
    { id: 'enhance', name: 'AI Enhance', icon: <Sparkles className="w-5 h-5" />, desc: 'Upscale & rebuild details (AI)' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
      setResult(null);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', files[0]); // Only single file demo for now
      formData.append('mode', selectedMode);

      const token = localStorage.getItem('token');
      
      const { data } = await axios.post(backendUrl + '/api/image/optimize', formData, {
        headers: { 
          token,
          'Content-Type': 'multipart/form-data' 
        }
      });

      if (data.success) {
        setResult({
          originalUrl: URL.createObjectURL(files[0]),
          newUrl: data.resultUrl,
          originalSize: data.originalSizeKB,
          newSize: data.newSizeKB,
          ratio: data.reductionRatio
        });
        toast.success("Optimization Complete!");
      } else {
        toast.error(data.message || "Failed to process");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 w-full flex flex-col items-center">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-medium tracking-wide inline-flex items-center gap-2 mb-4 shadow-sm">
          <Sparkles className="w-4 h-4" /> The AI Image Studio
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4">
          Unleash <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Perfection</span> <br/> in Every Pixel.
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Compress, resize, or magically rescue poor-quality photos with our advanced AI upscaler algorithms.
        </p>
      </motion.div>

      {/* Main Studio Console */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Upload Zone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative group"
        >
          {/* Glowing backdrop effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div 
            className={`relative h-[480px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ease-in-out px-6 ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-300 bg-white/70 backdrop-blur-xl'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              accept="image/*"
            />
            
            <AnimatePresence mode="popLayout">
              {files.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center pointer-events-none"
                >
                  <div className="p-5 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-inner">
                    <UploadCloud className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Drag & Drop Media</h3>
                  <p className="text-slate-500 text-center mb-6">Supports JPG, PNG, WEBP up to 15MB</p>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors shadow-lg">
                    Browse Files
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <div className="grid grid-cols-2 gap-4 w-full px-8">
                    {files.slice(0, 4).map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-slate-500 font-medium">Ready to process {files.length} file{files.length > 1 ? 's': ''}.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel: Settings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Modes Card */}
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
              <SlidersHorizontal className="w-5 h-5 text-violet-600"/> Optimization Mode
            </h3>
            
            <div className="flex flex-col gap-3">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-start gap-4 p-3 rounded-xl border text-left transition-all duration-300 ${selectedMode === mode.id ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <div className={`p-2 rounded-lg ${selectedMode === mode.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${selectedMode === mode.id ? 'text-violet-900' : 'text-slate-700'}`}>{mode.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-sm font-medium">Credits Cost</span>
              <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full text-sm">
                {selectedMode === 'enhance' ? '1 Credit' : 'Free'}
              </span>
            </div>

            <button 
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${files.length > 0 && !isProcessing ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  Processing Engine...
                </span>
              ) : files.length > 0 ? `Process Image` : 'Select Files First'}
            </button>
            
            {files.length > 0 && selectedMode === 'enhance' && (
               <p className="text-xs text-center text-slate-400 mt-4 flex justify-center items-center gap-1">
                 <Info className="w-3 h-3"/> AI Enhancement takes 5-10 seconds.
               </p>
            )}
          </div>
        </motion.div>

      </div>

      {/* Result Display Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mt-12 bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
          >
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center pb-6 border-b border-slate-100">
              Optimization Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
              {/* vs Badge */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 items-center justify-center z-10 text-slate-400 font-bold">
                VS
              </div>

              {/* Original */}
              <div className="flex flex-col gap-4">
                 <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm aspect-video bg-slate-50 flex items-center justify-center">
                    <img src={result.originalUrl} className="max-w-full max-h-full object-contain" alt="Original" />
                    <div className="absolute top-3 left-3 bg-slate-900/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      Original
                    </div>
                 </div>
                 <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <p className="text-slate-500 text-sm mb-1">File Size</p>
                    <p className="text-2xl font-bold text-slate-700">{result.originalSize} KB</p>
                 </div>
              </div>

              {/* Optimized */}
              <div className="flex flex-col gap-4">
                 <div className="relative group rounded-2xl overflow-hidden border-2 border-violet-200 shadow-sm aspect-video bg-slate-50 flex items-center justify-center">
                    <img src={result.newUrl} className="max-w-full max-h-full object-contain" alt="Optimized" />
                    <div className="absolute top-3 right-3 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      Optimized
                    </div>
                 </div>
                 <div className="bg-violet-50 rounded-xl p-4 text-center border border-violet-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-violet-500 rounded-bl-full opacity-10"></div>
                    <p className="text-violet-600/70 text-sm font-semibold mb-1 w-full flex justify-center items-center gap-2">
                       New Size <ArrowRight className="w-4 h-4"/>
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-2xl font-bold text-violet-900">{result.newSize} KB</p>
                      <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-sm shrink-0">
                        -{result.ratio}
                      </span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
               <a 
                 href={result.newUrl} 
                 download="optimized-image" 
                 className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
               >
                 <Download className="w-5 h-5" /> Download Optimized File
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizerStudio;

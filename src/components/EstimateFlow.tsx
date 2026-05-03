import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertCircle, RotateCcw } from 'lucide-react';
import EstimateResults from './EstimateResults';

interface FormData {
  posizione: string;
  letti: number;
  bagni_privati: number;
  bagni_condivisi: number;
  stanze_totali: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

interface EstimateFlowProps {
  onClose: () => void;
  step: 'scraping' | 'results' | 'error';
  formData: FormData;
  scrapeData: AnyData | null;
  error: string | null;
  onRetry: () => void;
}

export default function EstimateFlow({ onClose, step, formData, scrapeData, error, onRetry }: EstimateFlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 overflow-hidden ${
        step === 'results' ? 'bg-white' : 'bg-black/40 backdrop-blur-sm p-4 sm:p-6 lg:p-12'
      }`}
      onClick={step === 'results' ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white flex flex-col relative overflow-hidden transition-all duration-500 shadow-2xl ${
          step === 'results'
            ? 'w-full h-full rounded-none'
            : 'rounded-[2rem] w-full max-w-[70rem] my-auto max-h-[95vh]'
        }`}
      >
        {step !== 'results' && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center bg-[#0D0D0D]/8 text-[#0D0D0D] hover:bg-[#0D0D0D]/15 transition-colors z-[110]"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center min-h-[400px]"
              >
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <AlertCircle size={36} className="text-red-400" strokeWidth={1.5} />
                </div>
                <h2 className="font-title text-[28px] text-[#0D0D0D] mb-3">Something went wrong</h2>
                <p className="text-[#676767] text-[15px] leading-relaxed max-w-sm mb-8">
                  {error ?? "We couldn't calculate the estimate. Check your connection and try again."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-medium text-[15px] hover:bg-brand-light transition-colors"
                  >
                    <RotateCcw size={16} />
                    Try again
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 border border-[#0D0D0D] text-[#0D0D0D] px-6 py-3 rounded-full font-medium text-[15px] hover:bg-black/5 transition-colors"
                  >
                    Edit details
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'scraping' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center min-h-[500px] md:min-h-[700px]"
              >
                <div className="max-w-lg mx-auto flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-ha-border/50 rounded-full" />
                    <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-2 border-4 border-brand/20 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0D0D0D] tracking-tight mb-4">
                    Analysing...
                  </h2>
                  <p className="text-[#676767] font-light leading-relaxed">
                    We're analysing local market data and calculating your property's earning potential. It will only take a few seconds.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'results' && scrapeData && (
              <EstimateResults scrapeData={scrapeData} formData={formData} onClose={onClose} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

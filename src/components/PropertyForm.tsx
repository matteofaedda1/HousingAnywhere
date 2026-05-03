import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, MapPin, Search, Loader2, ArrowRight } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

const DEFAULT_SUGGESTIONS = [
  { description: 'Milan, Italy', main_text: 'Milan', secondary_text: 'Italy' },
  { description: 'Rome, Italy', main_text: 'Rome', secondary_text: 'Italy' },
  { description: 'Bologna, Italy', main_text: 'Bologna', secondary_text: 'Italy' },
  { description: 'Barcelona, Spain', main_text: 'Barcelona', secondary_text: 'Spain' },
  { description: 'Madrid, Spain', main_text: 'Madrid', secondary_text: 'Spain' },
];

const MIN_VALUES: Record<string, number> = {
  letti: 1,
  bagni_privati: 0,
  bagni_condivisi: 0,
  stanze_totali: 1,
};

const MAX_VALUES: Record<string, number> = {
  letti: 2,
  bagni_privati: 1,
};

interface PropertyFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  hideTitle?: boolean;
}

interface FormData {
  posizione: string;
  letti: number;
  bagni_privati: number;
  bagni_condivisi: number;
  stanze_totali: number;
}

interface Suggestion {
  description: string;
  main_text: string;
  secondary_text: string;
}

interface SectionProps {
  id: 'location' | 'details';
  label: string;
  value: string;
  placeholder: string;
  children?: React.ReactNode;
  isActive: boolean;
  onSelect: (id: 'location' | 'details' | null) => void;
  locationInputRef?: React.RefObject<HTMLInputElement | null>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  locationInput: string;
  setLocationInput: React.Dispatch<React.SetStateAction<string>>;
  setCityConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingSuggestions: boolean;
  suggestions: Suggestion[];
  handleSelectSuggestion: (s: Suggestion) => void;
  direction: number;
}

const Section = ({
  id, label, value, placeholder, children, isActive, onSelect,
  locationInputRef, formData, setFormData,
  locationInput, setLocationInput, setCityConfirmed,
  isLoadingSuggestions, suggestions, handleSelectSuggestion, direction,
}: SectionProps) => {
  const dropdownContent = (
    <div className="relative z-10">
      {id === 'location' ? (
        isLoadingSuggestions && suggestions.length === 0 ? (
          <div className="p-6 md:p-10 text-center">
            <div className="w-16 h-16 bg-[#0D0D0D]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="animate-spin text-[#676767]" size={24} />
            </div>
            <div className="text-[#0D0D0D] font-normal">Searching...</div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="py-2 px-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={`${s.description}-${i}`}
                onClick={() => handleSelectSuggestion(s)}
                className="w-full text-left px-4 md:px-6 py-3 rounded-xl first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] md:hover:bg-[#0D0D0D]/5 transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#0D0D0D]/5 flex items-center justify-center text-[#676767] flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="text-[13px] md:text-[14px] text-[#0D0D0D] font-normal">
                  {s.main_text}
                  {s.secondary_text && (
                    <span className="text-[#676767] ml-1.5 font-light">{s.secondary_text}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : !isLoadingSuggestions ? (
          <div className="p-6 md:p-10 flex flex-col items-start">
            <div className="w-10 h-10 bg-[#0D0D0D]/5 rounded-full flex items-center justify-center mb-3">
              <Search className="text-[#676767]" size={18} />
            </div>
            <div className="text-[#0D0D0D] font-normal mb-1">Search for a city</div>
            <div className="text-[#676767] text-sm font-light">Start typing to see suggestions</div>
          </div>
        ) : (
          <div className="p-6 md:p-10 text-center">
            <div className="w-16 h-16 bg-[#0D0D0D]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="animate-spin text-[#676767]" size={24} />
            </div>
          </div>
        )
      ) : (
        children
      )}
    </div>
  );

  return (
    <div
      className={`relative group ${isActive ? 'z-20' : 'z-10'} ${id === 'location' ? 'md:flex-[1.5]' : 'md:flex-1'} min-w-0`}
      onClick={() => {
        onSelect(id);
        if (id === 'location' && !isActive) {
          setTimeout(() => locationInputRef?.current?.focus(), 50);
        }
      }}
    >
      {/* Desktop */}
      <div className={`hidden md:flex flex-col px-8 rounded-full cursor-pointer transition-all duration-300 h-12 justify-center items-start relative ${!isActive ? 'hover:bg-[#0D0D0D]/5' : ''}`}>
        {isActive && (
          <motion.div
            layoutId="active-section-bg"
            className="absolute inset-0 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          />
        )}
        <div className="relative z-10 flex flex-col justify-center items-start">
          <span className="text-[12px] font-medium text-[#0D0D0D] mb-0.5 whitespace-nowrap">{label}</span>
          {id === 'location' ? (
            <div className="flex items-center gap-2 w-full min-w-0">
              {isActive ? (
                <input
                  ref={locationInputRef}
                  type="text"
                  autoFocus
                  placeholder={placeholder}
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setCityConfirmed(false);
                    setFormData((prev) => ({ ...prev, posizione: '' }));
                  }}
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[14px] text-[#0D0D0D] placeholder:text-[#ADADAD] w-full font-normal min-w-0"
                />
              ) : (
                <span className={`text-[14px] truncate flex-1 min-w-0 font-normal ${formData.posizione ? 'text-[#0D0D0D]' : 'text-[#ADADAD]'}`}>
                  {formData.posizione || placeholder}
                </span>
              )}
            </div>
          ) : (
            <span className={`text-[14px] truncate min-w-0 font-normal ${value ? 'text-[#0D0D0D]' : 'text-[#ADADAD]'}`}>
              {value || placeholder}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence custom={direction}>
        {isActive && (
          <motion.div
            layoutId="search-dropdown"
            className={`hidden md:block absolute top-[calc(100%+1rem)] mt-2 bg-white rounded-[2rem] shadow-2xl border border-[#EBEBEB]/50 z-50 overflow-hidden w-[420px] ${id === 'location' ? 'left-0' : 'right-0 p-8'}`}
            style={{ transformOrigin: 'top center' }}
            initial={{ opacity: 0, scale: direction === 0 ? 0.94 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: direction === 0 ? 0.94 : 1 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={`${id}-content-desktop`}
              custom={direction}
              initial={{ x: direction !== 0 ? direction * 40 : 0, y: direction === 0 ? -12 : 0, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: direction !== 0 ? -direction * 40 : 0, y: direction === 0 ? 12 : 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {dropdownContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile */}
      <div className="md:hidden">
        {isActive ? (
          <div className="bg-white rounded-[2rem] shadow-xl border border-[#EBEBEB]/50 p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h2 className="text-[20px] font-semibold text-[#0D0D0D] leading-tight">
                {id === 'location' ? 'Where is it located?' : 'Property details'}
              </h2>
            </div>
            {id === 'location' && (
              <div className="bg-[#0D0D0D]/5 rounded-xl px-4 py-3 mb-2 flex items-center gap-3">
                <Search size={20} className="text-[#676767]" />
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder={placeholder}
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setCityConfirmed(false);
                    setFormData((prev) => ({ ...prev, posizione: '' }));
                  }}
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[15px] text-[#0D0D0D] placeholder:text-[#ADADAD] w-full font-normal"
                />
              </div>
            )}
            <div>{dropdownContent}</div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-ha-bg rounded-2xl px-5 py-4 cursor-pointer">
            <span className="text-[14px] font-medium text-[#676767]">{label}</span>
            <span className={`text-[14px] font-normal truncate ml-4 ${value ? 'text-[#0D0D0D]' : 'text-[#ADADAD]'}`}>
              {value || placeholder}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface CounterRowProps {
  label: string;
  sublabel?: string;
  field: string;
  formData: FormData;
  onUpdate: (field: string, delta: number) => void;
}

const CounterRow = ({ label, sublabel, field, formData, onUpdate }: CounterRowProps) => {
  const min = MIN_VALUES[field] ?? 0;
  const max = MAX_VALUES[field] ?? Infinity;
  const value = (formData as unknown as Record<string, number>)[field];
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#EBEBEB]/30 last:border-0 gap-6 text-left">
      <div className="flex-1 text-left">
        <div className="text-[15px] md:text-[16px] font-normal text-[#0D0D0D]">{label}</div>
        {sublabel && <div className="text-[12px] text-[#676767]">{sublabel}</div>}
      </div>
      <div className="flex items-center gap-3 bg-[#0D0D0D]/5 p-1 rounded-full">
        <button
          type="button"
          onClick={() => onUpdate(field, -1)}
          disabled={value <= min}
          className="w-8 h-8 rounded-full bg-white text-[#676767] flex items-center justify-center hover:bg-ha-melon hover:text-[#0D0D0D] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-90"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <span className="w-6 text-center text-[15px] font-medium text-[#0D0D0D]">{value}</span>
        <button
          type="button"
          onClick={() => onUpdate(field, 1)}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-white text-[#676767] flex items-center justify-center hover:bg-ha-melon hover:text-[#0D0D0D] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-90"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default function PropertyForm({ onSubmit, hideTitle }: PropertyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    posizione: '',
    letti: 1,
    bagni_privati: 0,
    bagni_condivisi: 1,
    stanze_totali: 2,
  });

  const [locationInput, setLocationInput] = useState('');
  const [cityConfirmed, setCityConfirmed] = useState(false);

  const [activeSection, setActiveSection] = useState<'location' | 'details' | null>(null);
  const [direction, setDirection] = useState(0);
  const [lastFetchedInput, setLastFetchedInput] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(DEFAULT_SUGGESTIONS);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleSetSection = (section: 'location' | 'details' | null) => {
    if (section === 'details' && activeSection === 'location') setDirection(1);
    else if (section === 'location' && activeSection === 'details') setDirection(-1);
    else setDirection(0);
    setActiveSection(section);
  };

  useEffect(() => {
    if (activeSection === 'location') {
      setTimeout(() => locationInputRef.current?.focus(), 0);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        handleSetSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeSection === 'location' && locationInput !== lastFetchedInput) {
        fetchSuggestions(locationInput);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [locationInput, activeSection, lastFetchedInput]);

  const fetchSuggestions = async (input: string) => {
    setLastFetchedInput(input);
    if (!input.trim()) {
      setSuggestions(DEFAULT_SUGGESTIONS);
      setIsLoadingSuggestions(false);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/housinganywhere-location-autocomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        return;
      }
      setSuggestions(DEFAULT_SUGGESTIONS);
    } catch {
      setSuggestions(DEFAULT_SUGGESTIONS);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setFormData((prev) => ({ ...prev, posizione: s.description }));
    setLocationInput(s.description);
    setLastFetchedInput(s.description);
    setCityConfirmed(true);
    handleSetSection('details');
  };

  const updateCounter = (field: string, delta: number) => {
    const min = MIN_VALUES[field] ?? 0;
    const max = MAX_VALUES[field] ?? Infinity;
    setFormData((prev) => ({
      ...prev,
      [field]: Math.min(max, Math.max(min, (prev as unknown as Record<string, number>)[field] + delta)),
    }));
  };

  const handleSubmit = () => {
    if (!cityConfirmed || !formData.posizione) {
      handleSetSection('location');
      setTimeout(() => locationInputRef.current?.focus(), 50);
      return;
    }
    onSubmit(formData);
  };

  const detailsValue = `${formData.letti} beds · ${formData.stanze_totali} rooms`;

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-[90rem] mx-auto font-sans"
    >
      {!hideTitle && (
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl md:text-[28px] font-bold text-[#0D0D0D] mb-2 leading-tight">
            Calculate your property estimate
          </h3>
          <p className="text-[#676767] text-[15px]">Enter location and details to receive an earnings estimate</p>
        </div>
      )}

      <div className="max-w-[56rem] mx-auto w-full">
        <div className="bg-white md:bg-white rounded-3xl md:rounded-full p-4 md:p-2 flex flex-col md:flex-row items-stretch md:items-center h-auto md:h-16 transition-all duration-300 gap-2 md:gap-0 shadow-xl md:shadow-none">
          <Section
            id="location"
            label="Where"
            value={formData.posizione}
            placeholder="Search city or neighbourhood"
            isActive={activeSection === 'location'}
            onSelect={handleSetSection}
            locationInputRef={locationInputRef}
            formData={formData}
            setFormData={setFormData}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            setCityConfirmed={setCityConfirmed}
            isLoadingSuggestions={isLoadingSuggestions}
            suggestions={suggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            direction={direction}
          />

          <Section
            id="details"
            label="Property"
            value={detailsValue}
            placeholder="Add details"
            isActive={activeSection === 'details'}
            onSelect={handleSetSection}
            formData={formData}
            setFormData={setFormData}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            setCityConfirmed={setCityConfirmed}
            isLoadingSuggestions={isLoadingSuggestions}
            suggestions={suggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            direction={direction}
          >
            <div className="space-y-1">
              <CounterRow label="Beds" field="letti" formData={formData} onUpdate={updateCounter} />
              <CounterRow label="Private bathrooms" sublabel="For this room only" field="bagni_privati" formData={formData} onUpdate={updateCounter} />
              <CounterRow label="Shared bathrooms" sublabel="Shared with others" field="bagni_condivisi" formData={formData} onUpdate={updateCounter} />
              <CounterRow label="Total rooms" sublabel="In the apartment" field="stanze_totali" formData={formData} onUpdate={updateCounter} />
            </div>
          </Section>

          <button
            onClick={handleSubmit}
            className="mt-1 md:mt-0 md:ml-2 bg-brand hover:bg-brand-dark text-white h-[52px] md:h-12 pl-5 pr-1.5 md:pl-6 md:pr-1.5 rounded-full transition-all duration-300 flex items-center justify-between md:justify-center gap-3 group active:scale-95 w-full md:w-auto max-w-none mx-auto md:mx-0 py-1"
          >
            <span className="font-semibold text-[15px] text-left">Get Estimate</span>
            <div className="bg-white/20 group-hover:bg-white/30 rounded-full w-[40px] h-[40px] md:w-9 md:h-9 flex items-center justify-center overflow-hidden relative transition-colors shrink-0">
              <ArrowRight size={20} strokeWidth={2} className="absolute transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%]" />
              <ArrowRight size={20} strokeWidth={2} className="absolute -translate-x-[150%] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

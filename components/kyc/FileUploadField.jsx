'use client';
import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

function splitBilingual(text) {
  const idx = text.indexOf(' / ');
  if (idx === -1) return [text, ''];
  return [text.slice(0, idx), text.slice(idx + 3)];
}

export default function FileUploadField({ draftId, docKey, label, instructions, required, value, onChange }) {
  const [status, setStatus] = useState('idle'); // idle | uploading | error
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setError('Archivo demasiado grande (máx. 10MB) / File too large (max 10MB)');
      return;
    }
    if (!VALID_TYPES.includes(file.type)) {
      setError('Formato no permitido — use PDF, JPG o PNG / Format not allowed — use PDF, JPG or PNG');
      return;
    }

    setStatus('uploading');
    setError('');

    const supabase = createSupabaseBrowserClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    // Unique path per attempt — avoids needing upsert/update storage permissions
    const path = `${draftId}/${docKey}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(path, file);

    if (uploadError) {
      setStatus('error');
      setError('Error al subir el archivo / Upload error');
      return;
    }

    setStatus('idle');
    onChange({ key: docKey, label, path, original_filename: file.name, uploaded_at: new Date().toISOString() });
  }

  function handleRemove() {
    setError('');
    onChange(null);
  }

  const [labelEs, labelEn] = splitBilingual(label);
  const [instrEs, instrEn] = instructions ? splitBilingual(instructions) : ['', ''];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5">
      <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-100 leading-snug">
        <span className="block">{labelEs}{!required && <span className="text-gray-400 dark:text-gray-500 text-xs font-normal"> (opcional)</span>}</span>
        {labelEn && <span className="block text-gray-400 dark:text-gray-500 font-normal italic">{labelEn}{!required && ' (optional)'}</span>}
      </p>
      {instructions && (
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3 leading-snug">
          <span className="block">{instrEs}</span>
          {instrEn && <span className="block text-gray-400 dark:text-gray-500 italic">{instrEn}</span>}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <Check size={13} /> Completo, legible, a color / Complete, legible, color
        </span>
        <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
          <X size={13} /> Sin dedos, reflejos ni sombras / No fingers, glare or shadows
        </span>
      </div>

      {value ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2.5">
          <span className="text-sm text-green-700 dark:text-green-400 truncate flex items-center gap-1.5">
            <Check size={15} /> {value.original_filename}
          </span>
          <button type="button" onClick={handleRemove} className="text-xs text-red-500 hover:underline ml-3 shrink-0">
            Eliminar / Remove
          </button>
        </div>
      ) : (
        <>
          <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-[#FF491A] hover:text-[#FF491A] transition">
            {status === 'uploading' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Subiendo... / Uploading...
              </>
            ) : (
              'Seleccionar archivo / Choose file (PDF, JPG, PNG — máx. 10MB)'
            )}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={status === 'uploading'}
              className="hidden"
            />
          </label>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      )}
    </div>
  );
}

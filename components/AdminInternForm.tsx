'use client';

import React, { useState } from 'react';
import { Camera, ImagePlus, User, Quote, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AdminInternFormProps {
  onSuccess?: () => void;
}

export default function AdminInternForm({ onSuccess }: AdminInternFormProps) {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Ukuran file foto maksimal 8 MB.');
        return;
      }
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama anak magang wajib diisi.');
      return;
    }
    if (!experience.trim()) {
      setErrorMsg('Pengalaman magang wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('experience', experience.trim());
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Gagal menyimpan data anak magang.');
      }

      setSuccessMsg('Foto dan data anak magang berhasil ditambahkan dan langsung tampil di website!');
      setName('');
      setExperience('');
      setPhoto(null);
      setPreviewUrl(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Tambah Foto & Pengalaman Anak Magang</h3>
          <p className="text-xs text-slate-500">
            Foto dan pengalaman yang diunggah akan langsung muncul di carousel magang.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-semibold text-emerald-800">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-semibold text-rose-800">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Nama Lengkap Anak Magang *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Contoh: Rian Pratama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Foto Anak Magang *
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-4 text-center transition bg-slate-50 hover:bg-teal-50/50">
                <ImagePlus className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-teal-800">Pilih Foto dari Galeri / Komputer</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Format JPG, PNG, atau WebP (Maks. 8 MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-md shrink-0">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Cerita & Pengalaman Selama Magang *
          </label>
          <div className="relative">
            <Quote className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={4}
              required
              placeholder="Tuliskan apa saja yang dipelajari dan dikerjakan selama magang di PT BETAMI..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan ke Sistem...</span>
            </>
          ) : (
            <span>Simpan & Tampilkan di Website</span>
          )}
        </button>
      </form>
    </div>
  );
}

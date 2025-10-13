"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';

export default function LinkLayoutModal({ isOpen, link, onClose, onSave }) {
  const [layout, setLayout] = useState('classic');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (link) {
      setLayout(link.layout || 'classic');
      setThumbnail(link.thumbnail || '');
    }
  }, [link]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const confirm = () => {
    if (!link) return;
    onSave({ ...link, layout, thumbnail });
  };

  if (!link) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-2xl w-[100vw] sm:w-2xl h-[100dvh] sm:h-auto sm:rounded-xl rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white">
          <DialogTitle className="text-xl font-semibold">Layout</DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-5">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Choose a layout for your link</div>
            <div className="space-y-3">
              <label className={`block rounded-2xl border ${layout==='classic'?'border-black':'border-gray-200'} p-4 cursor-pointer`}> 
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Classic</div>
                    <div className="text-sm text-gray-600">Efficient, direct and compact.</div>
                  </div>
                  <input type="radio" name="layout" checked={layout==='classic'} onChange={()=>setLayout('classic')} />
                </div>
              </label>
              <label className={`block rounded-2xl border ${layout==='featured'?'border-black':'border-gray-200'} p-4 cursor-pointer`}> 
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Featured</div>
                    <div className="text-sm text-gray-600">Stand out with a larger attractive display.</div>
                  </div>
                  <input type="radio" name="layout" checked={layout==='featured'} onChange={()=>setLayout('featured')} />
                </div>
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    <span className="px-3 py-2 rounded-lg border">Add thumbnail</span>
                  </label>
                  {thumbnail && (
                    <img src={thumbnail} alt="thumb" className="mt-3 h-24 w-40 object-cover rounded-lg border" />
                  )}
                </div>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={confirm} className="bg-purple-600 hover:bg-purple-700">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



// src/components/admin/MenuCard.tsx

'use client';

import { IMenuItem } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

interface MenuCardProps {
  item: IMenuItem;
  onEdit: (item: IMenuItem) => void;
  onDelete: (item: IMenuItem) => void;
}

export default function MenuCard({ item, onEdit, onDelete }: MenuCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 transition-colors h-full flex flex-col">
      {/* Image */}
      <div className="relative h-32 bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.isAvailable ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
          <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-sm font-bold text-orange-500">
              {APP_CONFIG.CURRENCY_SYMBOL}
              {item.price.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Category</p>
            <p className="text-xs font-medium text-white">{item.category}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 p-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-300 transition-colors flex items-center justify-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span className="text-xs font-medium hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 p-2 rounded-lg bg-red-900 hover:bg-red-800 text-red-300 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-xs font-medium hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
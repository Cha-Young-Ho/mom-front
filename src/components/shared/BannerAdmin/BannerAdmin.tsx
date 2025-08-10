import React, { useState } from 'react';
import { BannerSlide } from '../../../services/bannerAPI';
import { isAdmin } from '../../../utils/auth';
import './BannerAdmin.css';
import BannerEditModal from './BannerEditModal';

interface BannerAdminProps {
  slides: BannerSlide[];
  onSlidesChange: (newSlides: BannerSlide[]) => void;
  onAddBanner: () => void;
}

const BannerAdmin: React.FC<BannerAdminProps> = ({
  slides,
  onSlidesChange,
  onAddBanner,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);

  if (!isAdmin()) {
    return null;
  }

  const handleAdd = () => {
    onAddBanner();
  };

  const handleSave = (slide: BannerSlide) => {
    if (editingSlide) {
      const newSlides = slides.map(s =>
        s.id === editingSlide.id ? { ...slide } : s
      );
      onSlidesChange(newSlides);
    }
    setIsEditModalOpen(false);
    setEditingSlide(null);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditingSlide(null);
  };

  return (
    <>
      <div className='banner-admin-controls'>
        <button
          className='banner-add-btn'
          onClick={handleAdd}
          title='새 배너 추가'
        >
          ➕ 배너 추가
        </button>
      </div>
      {isEditModalOpen && editingSlide && (
        <BannerEditModal
          slide={editingSlide}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default BannerAdmin;

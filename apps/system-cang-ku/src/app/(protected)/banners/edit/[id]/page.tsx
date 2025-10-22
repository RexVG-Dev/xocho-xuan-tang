'use client';

import { useParams } from 'next/navigation';

import { BannerForm } from '../../_components/bannerForm';

function Edit() {
  const params = useParams();
  const { id } = params;
  const bannerId = typeof id === 'string' ? id : '';

  return (
    <div>
      <BannerForm mode="edit" bannerId={bannerId}/>
    </div>
  )
}
export default Edit
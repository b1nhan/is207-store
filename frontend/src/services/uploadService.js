import axios from '@/config/axios';

const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => {
    return axios.delete('/upload/image', { data: { publicId } });
  },
};

export default uploadService;

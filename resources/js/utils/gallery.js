import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import lgThumbnail from 'lightgallery/plugins/thumbnail'

document.querySelectorAll('[data-gallery]').forEach((el) => {
  lightGallery(el, {
    plugins: [lgZoom, lgThumbnail],
    speed: 400,
    // Evaluation / OSS key — replace for production commercial use.
    licenseKey: '0000-0000-000-0000',
  })
})

export { lightGallery, lgZoom, lgThumbnail }

'use strict';

/* global GEILDANKEVR */

(function () {
  // GEILDANKEVR.single({
  //   container: document.getElementById('vrviewer'),
  //   single: {
  //     mediaType: 'video',
  //     url: {
  //       mp4: '/videos/video-sphere.MP4',
  //       webm: '/videos/videos-sphere.webm'
  //     },
  //     optionalConfig: {
  //       startRotation: 90,
  //       isAnimation: true,
  //       animationSpeed: 5,
  //       videoPoster: '/images/image-sphere-video-placeholder.jpg',
  //       videoMuted: true
  //     }
  //   }
  // });
  // GEILDANKEVR.single({
  //   container: document.getElementById('vrviewer'),
  //   single: {
  //     mediaType: 'image',
  //     url: '/images/image-sphere.jpg',
  //     optionalConfig: {
  //       startRotation: 54,
  //       isAnimation: true,
  //       animationSpeed: 2,
  //       clearColor: '#355c7d'
  //     }
  //   }
  // });
  GEILDANKEVR.gallery({
    container: document.getElementById('vrviewer'),
    singles: [{
      mediaType: 'image',
      url: '/images/image-00.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-01.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-02.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-03.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-04.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-05.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-portrait.jpg'
    }, {
      mediaType: 'image',
      url: '/images/image-landscape.jpg'
    }]
  });
})();
//# sourceMappingURL=main.js.map

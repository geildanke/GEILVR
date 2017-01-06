'use strict';

window.GEILDANKEVR.content = (function () {
  let SCOPE = {};

  /**
   * Creates the content for a stage, e.g.
   * - single image
   * - single video
   * - gallery
   * @param  { string } contentType 'single' or 'gallery'
   * @param  { object } stage {camera: {}, controls: {}, manager: {}, scene: {}}
   * @param  { object } config { mediaType: '', url: '', container: {elementObject} }
   * @return { void }
   */
  SCOPE.init = function (contentType, stage, config) {
    let createObjects;

    createObjects = {
      single: function () {
        GEILDANKEVR.content.single.init(stage, config);
      },
      gallery: function () {
        GEILDANKEVR.content.gallery.init(stage, config);
      }
    };

    createObjects[contentType]();
  };

  return SCOPE;
}());

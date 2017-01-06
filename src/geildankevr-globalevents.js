'use strict';

window.GEILDANKEVR.globalEvents = (function () {
  let SCOPE = {},
    handleVrDisplayChange = {};

  handleVrDisplayChange = function (e) {
    let isValid = false;

    isValid = typeof e === 'object' &&
    typeof e.detail === 'object' &&
    typeof e.detail.vrdisplay === 'object' &&
    typeof e.detail.vrdisplay.isPresenting === 'boolean';
    GEILDANKEVR.utils.errorChecker(isValid);

    GEILDANKEVR.utils.setVrDisplayMode(e.detail.vrdisplay.isPresenting);
  };

  window.addEventListener('vrdisplaypresentchange', handleVrDisplayChange);

  // PRIVATE START
  SCOPE.handleVrDisplayChange = handleVrDisplayChange;
  // PRIVATE END

  return SCOPE;
}());

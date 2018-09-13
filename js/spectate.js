const chgState = (vid) => {
  if(vid.paused) vid.play();
  else vid.pause();
}

(function(){

  const view = document.getElementById('view');

  view.addEventListener('dblclick', () => {
    try{
      view.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    catch(err){
      try{
        view.mozRequestFullScreen();
      }
      catch(err){
        try{
            view.msRequestFullscreen();
          }
          catch(err){
            view.requestFullscreen();
          }
        }
      }
  });

  view.addEventListener('click', () => chgState(view));

  document.addEventListener('keypress', (e) => {
    if(e.which == 32) chgState(view);
    return false;
  });


  let timeout;

  view.addEventListener('mousemove', () => {
    view.className = "";
    clearTimeout(timeout);
    timeout = setTimeout( () => {
      view.className = "noCursor";
    }, 1000);
  })

})();
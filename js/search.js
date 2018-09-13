window.onload = function(){
  const socket = io.connect();
  const search = document.getElementById('search');
  const datalist = document.getElementById('dtlist');

  search.addEventListener('keyup', (e) => {
    if(e.which === 13){
      if(search.value === datalist.firstChild.value){
        window.location.href += "../../../films/" + search.value;
      }
      else{
        window.location.href += "../../../search/" + search.value;
      }
      return false;
    }
    socket.emit('like', search.value);
    //console.log(search.value);
  });

  socket.on('like_result', (result) => {
    let iht = "";
    for(i of result){
      iht += '<option value="' + i.nom + '">';
    }
    //console.log(result[0]);
    datalist.innerHTML = iht;
  })
};

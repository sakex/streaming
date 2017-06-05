window.onload = function(){
  const socket = io.connect();
  const btn = document.getElementById('btn');

  btn.addEventListener("click", () => {
    const fname = document.getElementById('fname').value;
    const movie = {
      url: document.getElementById('url').value,
      name: fname
    }
    socket.emit("makeDL", movie);
  });

  socket.on("started", (str) => {
    document.getElementById('valid').innerHTML += str + "<br>";
  })
};

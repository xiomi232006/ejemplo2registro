
// Boton enviar formulario post
$("#btnSendPost").click(function (e) {
    e.preventDefault();
    // Capturo los datos enviados desde el formulario con id "postForm"
    var mensaje = $("#postText").val();

    if (mensaje.length > 0) {
      // Metodo de escritura para añadir elementos a la coleccion "post", 
      // si la coleccion no existe, la crea implicitamente
      var d = new Date();
      var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
      var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      db.collection("posts").add({
        mensaje: mensaje,
        fecha: strDate,
        hora: strHours
      })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          // Reseteo el formulario de registro de paises
          $("#postForm").trigger("reset");
          // Invoco al metodo obtienePosts()
          obtienePosts();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    } else {
      alert('Favor completar todos los campos');
    }

  });

  $("#btnSavePost").click(function (e) {
    e.preventDefault();
    // Capturo los datos enviados desde el formulario con id "postForm"
    var mensaje = $("#postText").val();
    var id = $("#idPost").val();
    console.log(id)
    if (mensaje.length > 0) {
      // Metodo de escritura para añadir elementos a la coleccion "post", 
      // si la coleccion no existe, la crea implicitamente
      var d = new Date();
      var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
      var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      db.collection("posts").doc(id).update({
        mensaje: mensaje,
        fecha: strDate,
        hora: strHours
      })
        .then(() => {
          // Reseteo el formulario de registro de post
          $("#postForm").trigger("reset");
          // Invoco al metodo obtienePosts()
          obtienePosts();
          $("#btnSendPost").removeClass("d-none");
          $("#btnSendPost").addClass("d-block");
          $("#btnSavePost").removeClass("d-block");
          $("#btnSendPost").addClass("d-none");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    } else {
      alert('Favor completar todos los campos');
    }

  });

  // Metodo que sirve para mostrar los post en la tabla
  function postList(data) {
    $("#postList").empty();
    if (data.length > 0) {
      let html = '';
      data.forEach(doc => {
        const post = doc.data();
        const div = `
          <div class="card bg-dark text-white  mt-3 mx-auto" style="border-radius: 1rem; width: 800px;">
            <div class="card-body">
              <p>${post.mensaje}</p>
              <p>Publicado el ${post.fecha} a las ${post.hora}</p>
              <button data-id="${doc.id}" class="btn btn-success btn-edit-post bi bi-pencil-fill">
                Editar
              </button>
              <button data-id="${doc.id}" class="btn btn-danger btn-delete-post bi bi-trash-fill">
                Eliminar
              </button>
            </div>
          </div>
        `;
        html += div;
      });
      $("#postList").append(html);
      // Agregar escucha a todos los botones delete
      const btnsDelete = document.querySelectorAll(".btn-delete-post");
      btnsDelete.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          deletePost(id);
        })
      })
      // Agregar escucha a todos los botones edit
      const btnsEdit = document.querySelectorAll(".btn-edit-post");
      btnsEdit.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          obtienePost(id);
        })
      })
    }
  };

  // Metodo que permite obtener los datos de la BD
  function obtienePosts() {
    db.collection("posts").get().then((snapshot) => {
      postList(snapshot.docs);
    })
  };
  function obtienePost(id) {
    db.collection("posts").doc(id).get().then((doc) => {
      // Si existe objeto, paso sus datos al formulario
      var post = doc.data()
      $("#postText").val(post.mensaje);
      $("#idPost").val(id);
      $("#btnSendPost").removeClass("d-block");
      $("#btnSendPost").addClass("d-none");
      $("#btnSavePost").removeClass("d-none");
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
  // Metodo que elimina registros
  function deletePost(id) {
    db.collection("posts").doc(id).delete().then(() => {
      // Si elimina Actualiza la tabla
      obtienePosts();
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
});
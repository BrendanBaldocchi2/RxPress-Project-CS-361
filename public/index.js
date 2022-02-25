var allPosts = [];

function clickPost () {
  window.location = "/posts/" + $(this).attr('data-index');
}

$("#icon").click(function() {
  window.location = "/";
}) 

$("#contract-accept").click(function() {
  var request = new XMLHttpRequest();

  var requestURL = '/posts' + '/remove';
  request.open('POST', requestURL);

  var context = {
    index: $('.single-post').attr('data-index'),
  };

  console.log($('.single-post'));

  var requestBody = JSON.stringify(context);

  request.setRequestHeader('Content-Type', 'application/json');

  request.addEventListener('load', function (event) {
    if (event.target.status !== 200) {
      var message = event.target.response;
      alert("Error submitting agreement: " + message);
    } else {
      window.location = "/";
    }
  });

  request.send(requestBody);
}) 


function toggleCreateModal () {
  var createModal = document.getElementById('create-modal');
  var createPostButton = document.getElementById('create-post-button');

  if (createModal.classList.contains('out')) {
    $('#create-modal').animate({right: 0, width: 0, marginRight: '0px'});
    $('#create-post-button').animate({right: 30});
    $('#create-post-button')[0].lastChild.classList.remove('fas');
    $('#create-post-button')[0].lastChild.classList.remove('fa-angle-right');
    $('#create-post-button')[0].lastChild.classList.add('fas');
    $('#create-post-button')[0].lastChild.classList.add('fa-angle-left');
    createModal.classList.remove('out');
    $('#modal-backdrop').fadeOut("fast");

    $('#title-input').val('');
    $('#body-input').val('');

  } else {
    $('#create-modal').animate({right: 0, width: 350, marginRight: '20px'});
    $('#create-post-button').animate({right: 385});
    $('#create-post-button')[0].lastChild.classList.remove('fas');
    $('#create-post-button')[0].lastChild.classList.remove('fa-angle-left');
    $('#create-post-button')[0].lastChild.classList.add('fas');
    $('#create-post-button')[0].lastChild.classList.add('fa-angle-right');
    createModal.classList.add('out');
    $('#modal-backdrop').fadeIn("fast");
  }
}

$("#create-post-button").on({click: toggleCreateModal});
$("#modal-close").on({click: toggleCreateModal});

let directions = ['left', 'right', 'top', 'bottom'];

$(function() {
  $("#return-button").on({
    mouseover: function() {
      $(this).css({position: 'absolute'});
      var x = Math.floor(Math.random() * (window.innerWidth - 100)) + "px";
      var y = Math.floor(Math.random() * (window.innerHeight - 100)) + "px";
      console.log(x,y);
      $(this).animate({
          left: x,
          top: y,
        });
    }
  });
});

function reInsertPosts(index, title, body) {

  var context = {
    index: index,
    title: title,
    minBody: body,
  };

  var postDiv = Handlebars.templates.post(context);

  var postsSection = document.getElementById('posts');
  postsSection.insertAdjacentHTML('beforeend', postDiv);

}

$(function() {
  $("#modal-accept").on({
    click: function() {
      var index = parseInt($('#posts').children()[$('#posts').children().length - 1].getAttribute('data-index')) + 1;
      var title = $('#title-input').val();
      var body = $('#body-input').val();

      var minBody = body;

      console.log(body);

      if (body.length > 350) {
        minBody = body.slice(0, 346) + '...';
      }

      var request = new XMLHttpRequest();

      var requestURL = '/posts' + '/add';
      request.open('POST', requestURL);

      var context = {
        index: index,
        title: title,
        minBody: minBody,
        body: body
      };

      var requestBody = JSON.stringify(context);

      request.setRequestHeader('Content-Type', 'application/json');

      request.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
          var message = event.target.response;
          alert("Error adding post: " + message);
        } else {
          var postDiv = Handlebars.templates.post(context);

          var postsSection = document.getElementById('posts');
          postsSection.insertAdjacentHTML('beforeend', postDiv);

          toggleCreateModal();
          addClickEvents();
        }
      });

      request.send(requestBody);
    }
  });
});

function addClickEvents () {
  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    postElems[i].addEventListener("click", clickPost);
  }
}

$(function() {
  $("#search-modal-button").on({
    click: function() {
      $('#search-bar').val('');

        var postContainer = document.getElementById('posts');
        while(postContainer.lastChild) {
          postContainer.removeChild(postContainer.lastChild);
        }

      for (let i = 0; i < allPosts.length; i++) {
        reInsertPosts(allPosts[i].index, allPosts[i].title, allPosts[i].minBody);
      }
      addClickEvents();
    }
  });
});

function toggleSearchModal() {

  var searchModal = document.getElementById('search-modal');
  var searchIcon = document.getElementById('search-container');

  if (searchModal.classList.contains('hidden')) {
    searchIcon.style.opacity = '0';
    searchModal.style.display = 'inline-block';
    $('#search-modal').animate({width: 400});
    searchModal.classList.remove('hidden');

  } else {
    $('#search-modal').animate({width: 0});
    setTimeout(function(){searchModal.style.display = 'none';searchIcon.style.opacity = '100';searchModal.classList.add('hidden');}, 300);

  }

}

$('#search-bar').on('input', function() {
  var query = $('#search-bar').val();
  console.log(query);

  var postContainer = document.getElementById('posts');
  while(postContainer.lastChild) {
    postContainer.removeChild(postContainer.lastChild);
  }

  for (var i = 0; i < allPosts.length; i++) {
    console.log();
    if (allPosts[i].title.toUpperCase().includes(query.toUpperCase()) || allPosts[i].minBody.toUpperCase().includes(query.toUpperCase())) {
      reInsertPosts(allPosts[i].index, allPosts[i].title, allPosts[i].minBody);
    }
  }
  addClickEvents();
});

function parsePostElem(postElem) {

  var post = {
    index: postElem.getAttribute('data-index'),
    title: postElem.querySelector('.post-title-container h2').lastChild.data.trim(),
    minBody: postElem.querySelector('.post-body-container p').lastChild.data.trim()
  };

  return post;

}

window.addEventListener('DOMContentLoaded', function () {

  var searchButton  = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', toggleSearchModal);
  }

  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    postElems[i].addEventListener("click", clickPost);
    allPosts.push(parsePostElem(postElems[i]));
  }

});
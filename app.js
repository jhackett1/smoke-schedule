// Initialise application
fetchShowData();

// Fetch data from the API
function fetchShowData(){
  // Variable to hold API endpoint
  let endpoint = "http://smoke.media/wp-json/shows/schedule";
  // Set up and make HTTP request
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    // Pass response to the processor function
    processData(xmlHttp.responseText);
  }
  xmlHttp.open("GET", endpoint, true); // true for asynchronous
  xmlHttp.send(null);
}
// Process and display data
function processData(res){
  // Now scroll to the right point in the timetable
  // First, turn the schedule into a JSON object and strip away the success field, leaving an array of days of shows
  var schedule = JSON.parse(res);
  // Grab the parent list elements;
  var ul = document.getElementsByClassName('day');
  // Fill each schedule day with shows
  for (var i = 0; i < schedule.length; i++) {
    // For each show in a day
    for (var j = 0; j < schedule[i].length; j++) {
      // Calculate left offset from tx_time
      var hour = schedule[i][j].tx_time.substr(0,2);
      var left = ((hour)*140)+90;
      // Create element and fill with content
      var newShow = document.createElement("LI");
      // Add a unique class based on the tx start time
      newShow.classList.add('tx' + schedule[i][j].tx_time.substr(0,2));
      // Add the content
      newShow.innerHTML = `
        <p>${schedule[i][j].genre}</p>
        <h3>${schedule[i][j].title}</h3>
        <a href="${schedule[i][j].permalink}"></a>
      `;
      // Apply left offset
      newShow.style.left = left + "px";
      // Add into DOM
      ul[i].appendChild(newShow);
    }
  }
  // Now, trigger the autoscroll and on-now marker
  setScroll();
}

function setScroll(){
  // What time is it?
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  // Grab the element to be scrolled
  var schedule = document.querySelector('ul.days');
  // Apply the scroll
  jQuery(schedule).animate({
    scrollLeft: (hour*140)-140
  }, 1000);
  // Put the marker in the right place
  var meridian = document.querySelector('div.meridian');
  meridian.style.left = ((hour*140)+(minutes/60)*140) + "px";
  meridian.style.opacity = 1;

  // Now work out which show is currently playing and add the class 'on-now'

  // Get day as a var where Sunday=0 and Saturday=6
  var today = date.getDay();
  // Add a today class to the correct <ul>
  var allDays = document.getElementsByClassName('day')
  // Remove the class from all
  for (var i = 0; i < allDays.length; i++) {
    allDays[i].classList.remove('today');
  }
  // And re-add the class to the right one
  var todayShows = allDays[today];
  todayShows.classList.add('today');

  // Add the class to the right show <li>, if it exists
  // First, remove from all
  var showHours = document.querySelectorAll('ul.day li').forEach(function(element){
    element.classList.remove('on-now');
  })
  // And re-add to correct one
  if (document.querySelector('ul.day.today li.tx' + hour)) {
    document.querySelector('ul.day.today li.tx' + hour).classList.add('on-now');
  }
}

// Update the meridian and scroll every two minutes
setInterval(function(){
  setScroll();
}, 120000);










// DRAGGABLE-NESS

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;
    var newScrollX, newScrollY;

    var dragged = [];
    var reset = function(i, el) {
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _window[removeEventListener](mouseup, el.mu, 0);
            _window[removeEventListener](mousemove, el.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
        for (i = 0; i < dragged.length;) {
            (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                (cont = el.container || el)[addEventListener](
                    mousedown,
                    cont.md = function(e) {
                        if (!el.hasAttribute('nochilddrag') ||
                            _document.elementFromPoint(
                                e.pageX, e.pageY
                            ) == cont
                        ) {
                            pushed = 1;
                            lastClientX = e.clientX;
                            lastClientY = e.clientY;

                            e.preventDefault();
                        }
                    }, 0
                );

                _window[addEventListener](
                    mouseup, cont.mu = function() {pushed = 0;}, 0
                );

                _window[addEventListener](
                    mousemove,
                    cont.mm = function(e) {
                        if (pushed) {
                            (scroller = el.scroller||el).scrollLeft -=
                                newScrollX = (- lastClientX + (lastClientX=e.clientX));
                            scroller.scrollTop -=
                                newScrollY = (- lastClientY + (lastClientY=e.clientY));
                            if (el == _document.body) {
                                (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                scroller.scrollTop -= newScrollY;
                            }
                        }
                    }, 0
                );
             })(dragged[i++]);
        }
    }
    if (_document.readyState == 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }
    exports.reset = reset;
}));

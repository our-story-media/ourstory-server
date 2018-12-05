var tracker = '';
window['ga-disable-' + tracker] = true;

function enableGA() {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', tracker, { 'anonymize_ip': true });
  window['ga-disable-' + tracker] = false;
}

function disableGA() {
  window['ga-disable-' + tracker] = true;
}


document.addEventListener('DOMContentLoaded', function () {

  window.odometerOptions = {
    format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  };
  // do your setup here
  console.log('Initialized app');

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#e53935"
      },
      "button": {
        "background": "#fff",
        "text": "#e53935"
      }
    },
    "position": "bottom-right",
    "type": "opt-in",
    "content": {
      "message": "This website uses a cookie for Google Analytics to aid our understanding of how people use video.",
      "link": "Learn More",
      "href": "https://bootlegger.tv/privacy",
      "dismiss": "Decline"
    },
    onInitialise: function (status) {
      var type = this.options.type;
      var didConsent = this.hasConsented();
      if (type == 'opt-in' && status == 'allow' && didConsent) {
        // enable cookies
        enableGA();
      }

    },

    onStatusChange: function (status, chosenBefore) {
      var type = this.options.type;
      var didConsent = this.hasConsented();

      if (type == 'opt-in' && status == 'allow' && didConsent) {
        // enable cookies
        enableGA();
      }
    },

    onRevokeChoice: function () {
      // console.log("revoke");

      var type = this.options.type;
      if (type == 'opt-in') {
        // disable cookies
        disableGA();
      }
    },
  })

  var currentdata;

  $.get('/landing/edition.json').then(function(data){
    // console.log(data);
    document.title = data.name;

    if (data.ifrc)
      $('#ifrc').show();
    else
      $('#ifrc').hide();
    if (data.bootlegger)
      $('#bootlegger').show();
    else
      $('#bootlegger').hide();

    $('#android').attr('href',data.android);

  });

  $.get('/auth/totalstatus').then(function (data) {
    // data.media = 1000;
    $('#mins').html(Math.round(data.mins / 60));
    $('#media').html(data.media);
    $('#users').html(data.users);
    $('#stories').html(data.stories);
    currentdata = data;
    //$('.odo').css('visibility','inherit');
    $('.odo').css('visibility', 'visible').hide().fadeIn('slow');
    setInterval(function () {
      currentdata.mins = currentdata.mins + 0.2;
      $('#mins').html(Math.round(currentdata.mins / 60));
    }, 5000);
  });

  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('lang') == 'ar')
  {
    document.body.style.direction = "rtl";
  }
});

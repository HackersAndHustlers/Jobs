// Cookies
function setCookie( name, value, expires, path, domain, secure ){
  var today = new Date();
  today.setTime( today.getTime() );
  if ( expires ){
    expires = expires * 1000 * 60 * 60 * 24;
  }
  var expires_date = new Date( today.getTime() + (expires) );
  
  document.cookie = name + "=" +escape( value ) +
  ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
  ( ( path ) ? ";path=" + path : "" ) +
  ( ( domain ) ? ";domain=" + domain : "" ) +
  ( ( secure ) ? ";secure" : "" );
}

function getCookie( check_name ) {
  var aAllCookies = document.cookie.split( ';' );
  var aTempCookie = '';
  var cookieName = '';
  var cookieValue = '';
  var bCookieFound = false;

  for ( i = 0; i < aAllCookies.length; i++ ){
    aTempCookie = aAllCookies[i].split( '=' );
    cookieName = aTempCookie[0].replace(/^\s+|\s+$/g, '');

    if (cookieName == check_name ){
      bCookieFound = true;
      if ( aTempCookie.length > 1 ){
        cookieValue = unescape( aTempCookie[1].replace(/^\s+$/g, '') );
      }
      return cookieValue;
      break;
    }
    aTempCookie = null;
    cookie_name = '';
  }
  if ( !bCookieFound ){
    return null;
  }
}


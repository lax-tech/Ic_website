if (axios) {
  console.log(' Axios loaded ')
}

let baseURL = '';

const axiosInstance = axios.create({
  baseURL,
  timeout: 180000,
  withCredentials: true,
  'Access-Control-Allow-Origin': '*',
  allow_origin: ['*'],
  allow_headers: ['Origin', 'Accept', 'Content-Type', 'X-CSRFToken'],
  allow_methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
  headers: {
    /* 
    Authorization: localStorage.getItem('access_token') ? 'JWT ' + localStorage.getItem('access_token') : null, */
    'X-CSRFToken': getCookie('csrftoken'),
    'Content-Type': 'application/json',
    accept: 'application/json'
  }
});
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Je Suis Dans L\'intercepteur')
    console.log(response)
    if (response.data && response.data.cookies) {
      Object.entries(response.data.cookies).forEach(([name, value]) => {
        console.log(name, value)
        setCookie(name, value)
      })
    }
    return response;
  }
);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}



function setCookie(name, value, days = null) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
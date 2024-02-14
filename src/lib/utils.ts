import { getFingerprint } from './fingerprintWrap';

// A Function to Get a Cookie
// https://www.w3schools.com/js/js_cookies.asp
export function getCookie(cname: string) {
  let name = cname + '=';
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
  return '';
}

// https://stackoverflow.com/a/24103596/3054511
export function setCookie(name: string, value: string, days: number) {
  let expires = '';
  let domain = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
    // https://stackoverflow.com/a/23086139/3054511
    domain = '; domain=oralall.com';
  }
  const cookieString = name + '=' + (value || '') + expires + domain + '; path=/';
  document.cookie = cookieString;
}

// check cookie fingerprint
// only for the first time
export async function checkCookieFingerprint() {
  let fingerprint = getCookie('fingerprint');
  if (fingerprint == '') {
    fingerprint = await getFingerprint();
    if (fingerprint) {
      setCookie('fingerprint', fingerprint, 365);
      return true;
    } else {
      return false;
    }
  }
  return false;
}

// check local storage fingerprint
export async function checkLocalStorageFingerprint() {
  let fingerprint = localStorage.getItem('fingerprint') || '';
  if (fingerprint.length < 5) {
    fingerprint = await getFingerprint();
    if (fingerprint && fingerprint.length > 5) {
      localStorage.setItem('fingerprint', fingerprint);
    }
  }
  return fingerprint;
}

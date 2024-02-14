import fpPromise from './fingerprintv3';

export async function getFingerprint() {
  let user_uuid = '';

  if (localStorage) {
    try {
      user_uuid = localStorage.getItem('user_uuid') || '';
      if (user_uuid === '' || user_uuid.length < 5) {
        const fp = await fpPromise.load();
        const fpGet = await fp.get();
        user_uuid = fpGet.visitorId;
        localStorage.setItem('user_uuid', user_uuid);
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  return user_uuid;
}

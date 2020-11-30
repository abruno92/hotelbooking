const googleLogIn = () => {
    return (
        <div className="wrapper">
            <div class="googleSignIn" data-onsuccess="onSignIn"></div>
        </div>
    );  
} 


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  
export const googleAuthentication = new GoogleAuthentication({
    callbackURL: '/__/auth/google'
  });
  
  app.get('/', (req, res, next) => {
    res.send(
      `<form action=${
        googleAuthentication.callbackPath
      } method="post"><button type="submit">Login</button></form>`
    );
  });
  
  app.post(googleAuthentication.callbackPath, async (req, res, next) => {
    googleAuthentication.redirectToProvider(req, res, next, {
      // you can pass some abritrary state through to the callback here
      state: {message: ' '}
    });
  });
  app.get(googleAuthentication.callbackPath, async (req, res, next) => {
    try {
      if (googleAuthentication.userCancelledLogin(req)) {
        return res.redirect('/');
      }
      const {
        accessToken, // use this to make requests to the Google API on behalf of the user
        refreshToken,
        profile,
        state 
      } = await googleAuthentication.completeAuthentication(req, res);
      res.json(profile);
    } catch (ex) {
      next(ex);
    }
  });

export default googleLogIn;
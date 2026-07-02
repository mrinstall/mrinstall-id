const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrf_protection = csrf({ cookie: true });

// Home web Controller
const web_session_controller = require('../../controllers/web/index').sessions;

// Routes for users sessions
const { body, validationResult } = require('express-validator');

router.get('/login', csrf_protection, web_session_controller.login_not_required, web_session_controller.new);
router.post('/login',
  csrf_protection,
  web_session_controller.login_not_required,
  [
    body('email').isString().trim().notEmpty().escape(),
    body('password').isString().notEmpty()
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array().map(e => ({ message: e.msg }));
      return res.redirect('/auth/login');
    }
    next();
  },
  web_session_controller.create
);
// router.post(
//   '/security_question',
//   csrf_protection,
//   web_session_controller.login_not_required,
//   web_session_controller.security_question
// );

router.get('/avoid_2fa', csrf_protection, web_session_controller.login_not_required, web_session_controller.avoid_2fa);

router.post(
  '/avoid_2fa',
  csrf_protection,
  web_session_controller.login_not_required,
  web_session_controller.avoid_2fa_email
);

router.get(
  '/disable_2fa',
  csrf_protection,
  web_session_controller.login_not_required,
  web_session_controller.disable_2fa
);

router.post('/tfa_verify', csrf_protection, web_session_controller.tfa_verify);

router.delete('/logout', web_session_controller.login_required, web_session_controller.destroy);
router.delete('/external_logout', web_session_controller.external_destroy);

module.exports = router;

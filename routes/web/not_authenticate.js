const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrf_protection = csrf({ cookie: true });

// Home web Controller
const web_user_controller = require('../../controllers/web/index').users;

// Routes for users creation
const { body, validationResult } = require('express-validator');

router.get('/sign_up', csrf_protection, web_user_controller.new);
router.post('/sign_up',
  csrf_protection,
  [
    body('username').isString().trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password1').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('password2').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/new', {
        user_info: req.body,
        errors: errors.array(),
        csrf_token: req.csrfToken()
      });
    }
    next();
  },
  web_user_controller.create
);
router.get('/activate', csrf_protection, web_user_controller.activate);
router.get('/password/request', csrf_protection, web_user_controller.password_request);
router.post('/password/request', csrf_protection, web_user_controller.password_send_email);
router.get('/password/reset', csrf_protection, web_user_controller.new_password);
router.post('/password/reset', csrf_protection, web_user_controller.change_password);
router.get('/confirmation', csrf_protection, web_user_controller.confirmation);
router.post('/confirmation', csrf_protection, web_user_controller.resend_confirmation);

// catch 404 and forward to error handler
router.use(function (req, res) {
  const err = new Error('Not Found');
  err.status = 404;
  res.locals.error = err;
  res.render('errors/not_found');
});

module.exports = router;

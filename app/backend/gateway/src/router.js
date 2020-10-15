const router = require('express').Router();
const { check } = require('express-validator');
const logger = require('../logger');
const TokenManager = require('../../utilities/tokenManager')(logger);
const authentificator = require('../../utilities/autentificator')(logger);
const validateInput = require('../../utilities/validateInput');
const Gateway = require('./gateway');

router.get('/user/:id', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            return res.json({ user: await Gateway.getUserById(req.params.id) });
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/post_tags/:postId', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            return res.json({ user: await Gateway.getTagsByPostId(req.params.postId) });
        } catch (err) {
            next(err);
        }
    }
]);


const jwt = require('jsonwebtoken');
const generateToken = (data, expiresIn) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: expiresIn ? expiresIn : '2h' });
}

router.get('/auth', [
    async (req, res, next) => {
        // const code = await tokenManager.getToken();
        // const tokenManager = new TokenManager(req.query.client_id, req.query.secret);
        const code = generateToken(req.query, '2m');
        const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Auth</title>
  </head>
  <body>
    <p><b>${req.query.client_id}</b> is requesting <b>full access</b> to your account.</p>
    <p>Do you approve?</p>

    <form action="${req.query.redirect_uri}?code=${code}" method="post">
      <div>
      <input type="hidden"  value="${req.query.client_id}">
      <input type="submit" value="Allow" id="allow">
      </div>
    </form>

  </body>
</html>
            `;
        return res.send(html);
    }
]);

router.post('/token', [
    async (req, res, next) => {
        console.log(req.body);
        res.end();
    }
]);

router.post('/callback', [
    async (req, res, next) => {
        console.log(req.query);
        console.log(req.body);
        res.json({ code: req.query.code, });
    }
]);


module.exports = router;
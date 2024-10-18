const argon2 = require('argon2');

(async () => {
    const password = '9IyrqiytuBxNCNX'; // Replace this with your actual admin password
    const hash = await argon2.hash(password);
    console.log('Hashed password:', hash);
})();

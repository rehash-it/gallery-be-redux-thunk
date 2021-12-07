module.exports = {
  jwtPrivateKey: process.env.JWT_SECRET || 'dsfsdfkasdjfkasdhfkashdflashfdfsdaf',
//  dburl:process.env.DATABASE_URL||'mongodb+srv://rootUser:25524825233@directory.d16b0.mongodb.net/tourgallery?retryWrites=true&w=majority',
 dburl: 'mongodb://127.0.0.1:27017/tourgallery',
  port: process.env.PORT || 9000
}



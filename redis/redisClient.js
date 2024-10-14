const redis = require("redis")

const redisClient = redis.createClient({
    host:process.env.PUBLIC_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
});

redisClient.connect()

redisClient.on('connect', () => {
    console.log("Connected to Redis");   
})

redisClient.on('error', (err) => {
    console.log("Redis Connection error",err);   
})

module.exports = redisClient
const express = require('express')
const appointment = require('./appoinment-route')
const auth = require('./auth-route')
const student = require('./student-route')
const professor = require('./professor-route')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('Hello, I am Ayush')
})
router.use('/appoint',appointment)
router.use('/auth',auth)
router.use('/student',student)
router.use('/professor',professor)
module.exports = router
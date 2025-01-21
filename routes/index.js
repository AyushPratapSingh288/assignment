const express = require('express')
const appointment = require('./appoinment-route')
const auth = require('./auth-route')
const student = require('./student-route')
const professor = require('./professor-route')
const userModel = require('../models/user-model')
const router = express.Router()

router.get('/',async (req,res)=>{
    const user = await userModel.find()
    res.send({user})
})
router.use('/appoint',appointment)
router.use('/auth',auth)
router.use('/student',student)
router.use('/professor',professor)
module.exports = router
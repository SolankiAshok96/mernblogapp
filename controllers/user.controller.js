const userModel = require("../model/userModel")
const bcrypt = require('bcrypt')

exports.getAllUsers = async(req,res) =>{
      const querobj = {}

      try{
           const user = await userModel.find(querobj)
            return res.status(201).send({
                 userCount : user.length,
                 success : true,
                  message : "get all user data",
                  user
            })  

      }catch(err){
         return res.status(500).send({
             success : false,
             message : "error get all user",
             err
         })
      }
}

exports.register = async(req,res) =>{
     try{
           const {username , email, password} = req.body             
              if(!username || !email ||!password){
                 return res.status(400).send({
                    success: false,
                        message: 'Please fill all fields'
                 })
              }

               const existingUser = await userModel.findOne({email})
                 
                 if(existingUser){
                     return res.status(401).send({
                         message : "user alredy exists",
                        
                     })
                 }

                 const hashedPassword = await bcrypt.hash(password,10)


                 const user = new userModel({username,email,password :hashedPassword})
                  await user.save()

                   res.status(201).send({
                        success :true,
                        message: "New User Created",
                        user
                   })

     }catch(err){
         console.log(err)

         return res.status(500).send({
             message : 'Error in Register callback',
             success: false,
            err
         })
     }
}



exports.login = async(req,res) =>{
      try{
          const {email , password} = req.body
          
          if(!email || !password){
             return res.status(401).send({
                 success: false,
                 message : "please provide email or password"
             })
          }
        
           const user = await userModel.findOne({email})
           if(!user){
             return res.status(200).send({
                success : false,
                message : 'email is not registered'
             })
           }

           const isMatch = await bcrypt.compare(password , user.password)

             if(!isMatch){
                 return  res.status(401).send({
                     success: false,
                     message: "Invalid username or password"
                 })
             }

              return res.status(200).send({
                 success: true,
                 message : "login successfully",
                 user
              })

      }catch(err){
            console.log(err)
            return res.status(500).send({
                success : false,
                 message : "Error in Login Callback",
                 err

            })
      }
}
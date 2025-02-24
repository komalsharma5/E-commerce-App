const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
//register
const register = async(req, res) =>{
    const {userName, email,password } = req.body

    try {

        const checkUser = await User.findOne({email})

        if(checkUser){
            return res.json({
                success : false,
                message : "email already exists"
            })
        }
      const hashPassword = await bcrypt.hash(password, 10) 
      
      const newUser = new User({
          userName,
          email,
          password : hashPassword
      })

      await newUser.save()
      res.status(200).json({
          success : true,
          message : "user created successfully"
      })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "server error"
        })
    }
}

//login
const login = async(req, res) =>{
    const { email, password } = req.body;

    try {
      const checkUser = await User.findOne({ email });
      if (!checkUser)
        return res.json({
          success: false,
          message: "User doesn't exists! Please register first",
        });
  
      const checkPasswordMatch = await bcrypt.compare(
        password,
        checkUser.password
      );
      if (!checkPasswordMatch)
        return res.json({
          success: false,
          message: "Incorrect password! Please try again",
        });
  
      const token = jwt.sign(
        {
          id: checkUser._id,
          role: checkUser.role,
          email: checkUser.email,
          userName: checkUser.userName,
        },
        "CLIENT_SECRET_KEY",
        { expiresIn: "3h" }
      );
  
      res.cookie("token", token, { httpOnly: true, secure: true }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured",
      });
    }
}


//logout
const logout = (req,res) =>{
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
      });
}


//auth middlewere
const authMiddlewere = async(req, res, next) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            success : false,
            message : "UnAuthorized User"
        })
    }
    try {
        const decode = jwt.verify(token, 'CLIENT_SECRET_KEY')  
        req.user = decode 
        next()
    } catch (error) {
        res.status(401).json({
            success : false,
            message : "Invalid token"
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    authMiddlewere
}
const express = require('express');
const dotenv = require('dotenv');
const {prisma}=require('./db/config')


dotenv.config();

const app = express();
app.use(express.json());
const authmiddleware=async(req,res,next)=>{
  const apikey="a1b2c3d4e5f67890123456789abcdef"
  const authapikey=req.headers.shipping_secret_key
  if (!authapikey){
    return res.status(403).json(
      { 
        error: "SHIPPING_SECRET_KEY is missing or invalid"
     }
    )
  }
  console.log(authapikey)
  if (authapikey===apikey){
      console.log("yes")
      next()
    }
  else{
    return res.status(403).json({
      error: "Failed to authenticate SHIPPING_SECRET_KEY"
    })
  }
  // if (!authapikey){
  //     return res.status(404).json(
  //         {error:"SHIPPING_SECRET_KEY is missing or invalid"}
  //     )
  // }
  // if (authapikey===apikey){
  //   console.log("yes")
  //     return true
  // }
  // else{
  //     return false
  // }
}
app.post('/api/shipping/create',authmiddleware,async(req,res)=>{
  const {userId, productId,count}=req.body
  if(!userId){
    return res.status(404).json(
      {
        error: "All fields required"
      }
    )
  }
  if(!productId){
    return res.status(404).json(
      {
        error: "All fields required"
      }
    )
  }
  if(!count){
    return res.status(404).json(
      {
        error: "All fields required"
      }
    )
  }
  if(!userId || !prisma|| !count){
    return res.status(404).json(
      {
        error: "All fields required"
      }
    )
  }
  try{
      const newship=await prisma.shipping.create({
          data:{userId,productId,count}
      })
      return res.status(201).json({
          id:newship.id,
          userId,
          productId,
          count,
          status:newship.status
      })
  }catch{}{
      return res.status(500).json({
          error:"Internal server error"
      })
  }
})
app.put("/api/shipping/cancel",authmiddleware,async(req,res)=>{
  const {shippingId}=req.body
  if (!shippingId){
    return res.status(404).json({ 
      error: "Missing shippingId"
  })
  }
  try{
    const findtheship=await prisma.shipping.findUnique({
      where:{id:shippingId}
    })
    console.log(findtheship)
    const updatedship=await prisma.shipping.update({
      where:{id:shippingId},
      data:{id: findtheship.id, 
        userId: findtheship.userId, 
        productId: findtheship.productId, 
        count: findtheship.count, 
        status: "cancelled" }
    })
    console.log(updatedship)
    return res.status(200).json({
        id: findtheship.id, 
        userId: findtheship.userId, 
        productId: findtheship.productId, 
        count: findtheship.count, 
        status: "cancelled" 
    })
  }catch{}{
    return res.status(500).json({
      error:"Internal server error"
  })
  }

})
app.get("/api/shipping/get",authmiddleware,async(req,res)=>{
  try{
    if(true){
      const alltherecord=await prisma.shipping.findMany()
    console.log(alltherecord)
    return res.status(200).json(
      alltherecord
    )
    }
    else{
      throw new Error("Failed to authenticate SHIPPING_SECRET_KEY")
    }
  }catch(error){
    return res.status(500).json({
      error:error
  })
  }
})
// app.get("/api/shipping/get?userId=:id",async(req,res)=>{
//   const {id}=req.params;
//   console.log(id)
//   return res.status(200).json(
//     id
//   )
//   // try{
//   // }catch{}{
//   //   return res.status(500).json({
//   //     error:"Internal server error"
//   // })
//   // }
// })



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
module.exports = app;
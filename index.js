const express = require('express');
const dotenv = require('dotenv');
const {prisma}=require('./db/config')


dotenv.config();

const app = express();
app.use(express.json());
const authmiddleware=async(req,res)=>{
  const apikey="a1b2c3d4e5f67890123456789abcdef"
  const authapikey=req.Headers['authapikey']
  console.log(authapikey)
  if (!authapikey){
      return res.status(404).json(
          {error:"not found"}
      )
  }
  if (authapikey===apikey){
      return {succes:true}
  }
  else{
      return {succes:false}
  }
}
authmiddleware();
app.post('/api/shipping/create',async(req,res)=>{
  const {userId, productId,count}=req.body
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
app.put("/api/shipping/cancel",async(req,res)=>{
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
app.get("/api/shipping/get",async(req,res)=>{
  try{
    const alltherecord=await prisma.shipping.findMany()
    console.log(alltherecord)
    return res.status(200).json(
      alltherecord
    )
  }catch{}{
    return res.status(500).json({
      error:"Internal server error"
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
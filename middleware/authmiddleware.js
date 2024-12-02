const authmiddleware=async(req,res)=>{
    const apikey="a1b2c3d4e5f67890123456789abcdef"
    const authapikey=req.headers['authapikey']
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
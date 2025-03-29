
const asyncHandler = (requestHabdler) => {
    return (req,res,next) =>{
        Promise
        .resolve(requestHabdler(req,res,next))
        .catch((error) => next(error))
    }
}


export default asyncHandler




// const asyncHandler = (fn) =>  async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }
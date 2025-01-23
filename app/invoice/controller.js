const {subject} = require('@casl/ability')
const Invoice = require('../invoice/model')
const {policyFor} = require('../../middlewares/policyModule')

const show = async(req,res,next)=>{
    try{

        let policy = policyFor(req.user)
        let subjectInvoice = subject('Invoice',{...invoice, user_id: invoice.user._id})
        if(!policy.can('read',subjectInvoice)){
            return res.json({
                error: 1,
                message: 'You are not allowed to perform this action'
            })
        }

        let {order_id} = req.params
        let invoice = 
        await Invoice
        .findOne({order: order_id})
        .populate('order')
        .populate('user')

        


        return res.json(invoice)
    } catch(error){
        return res.json({
            error: 1,
            message: 'Error when getting Invoice'
        })
    }
}

module.exports = {
    show
}
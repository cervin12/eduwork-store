const {AbilityBuilder, Ability} = require('@casl/ability')

const policies = {
    guest(user,{can}){
      can('read','Product')
    },
  
    user(user,{can}){
      can('read','Product')
      can('create','Order',{user_id: user._id})
      can('read','Order',{user_id:user._id})
      can('update','User',{_id:user._id})
      can('read','Cart',{user_id:user._id})
      can('update','Cart',{user_id:user._id})
      can('read','DeliveryAddress')
      can('create','DeliveryAddress',{user_id: user._id})
      can('update','DeliveryAddress',{user_id: user._id})
      can('delete','DeliveryAddress',{user_id: user._id}) 
      can('read','Invoice',{user_id:user._id})
    },
    admin(user,{can}){
      can('manage','all')
    }
  }
  
  const policyFor = user =>{
    let builder = new AbilityBuilder()
    if(user && typeof policies[user.role] === 'function'){
      policies[user.role](user,builder)
    }else{
      policies['guest'](user,builder)
    }
    return new Ability(builder.rules)
  }

module.exports = {
    policyFor
}
